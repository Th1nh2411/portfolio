/** Validate the source grids and regenerate PNG/SVG contact sheets + animated HTML.
 * Usage: node scripts/sprites/preview.mjs [output-directory]
 * No runtime or graphics dependencies beyond this project's TypeScript install.
 */
import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile, access } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { deflateSync } from 'node:zlib'
import vm from 'node:vm'
import ts from 'typescript'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const source = await readFile(join(root, 'src/game/sprites.ts'), 'utf8')
const ast = ts.createSourceFile('sprites.ts', source, ts.ScriptTarget.Latest, true)
const declaration = ast.statements.flatMap(s => ts.isVariableStatement(s) ? [...s.declarationList.declarations] : [])
  .find(d => d.name.getText(ast) === 'PALETTE')
assert(declaration && ts.isObjectLiteralExpression(declaration.initializer), 'PALETTE must be a literal')
const paletteKeys = declaration.initializer.properties.map(p => p.name.getText(ast).replace(/['"]/g, ''))
assert.equal(new Set(paletteKeys).size, paletteKeys.length, 'Duplicate palette keys')
const context = { exports: {} }
vm.runInNewContext(ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText, context)
const { PALETTE, ACHIEVEMENT_ICONS, ...exports } = context.exports
const badges = ['press_start', 'night_owl', 'polyglot', 'world_map', 'curious', 'completionist', 'messenger']
assert.deepEqual(Object.keys(ACHIEVEMENT_ICONS).sort(), badges.sort(), 'Achievement ids')
const sprites = [...Object.entries(exports), ...Object.entries(ACHIEVEMENT_ICONS)]
const specs = { PIGEON: [24, 16, 2], SUN: [9, 9, 1], MOON: [9, 9, 1], CARTRIDGE: [32, 24, 1], TROPHY: [9, 9, 1], CLOUD_A: [24, 10, 1], CLOUD_B: [24, 10, 1], BIRD: [7, 5, 2] }
for (const [key, hex] of Object.entries(PALETTE)) {
  assert.equal(key.length, 1)
  assert.match(hex, /^#[\da-f]{6}$/i)
}
for (const [name, sprite] of sprites) {
  const { w, h, frames } = sprite
  assert.deepEqual([w, h, frames.length], specs[name] ?? [16, 16, 1], `${name}: dimensions/frame count`)
  frames.forEach((frame, i) => {
    assert.equal(frame.length, h, `${name}[${i}]: height`)
    frame.forEach((row, y) => {
      assert.equal(row.length, w, `${name}[${i}][${y}]: width (${row})`)
      for (const c of row) assert(c === '.' || Object.hasOwn(PALETTE, c), `${name}: unknown colour ${c}`)
    })
  })
}
const output = resolve(process.argv[2] ?? join(tmpdir(), 'portfolio-sprites'))
await mkdir(output, { recursive: true })
const backgrounds = ['#f6efe7', '#1c1b2e', '#16152a']
const scale = 4, width = 1440, rowHeight = 112, height = sprites.length * rowHeight
const pixels = Buffer.alloc(width * height * 4)
function rgb(hex) { return hex.slice(1).match(/../g).map(v => parseInt(v, 16)) }
function rect(x, y, w, h, hex) {
  const color = rgb(hex)
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) {
    const offset = (yy * width + xx) * 4
    pixels[offset] = color[0]; pixels[offset + 1] = color[1]; pixels[offset + 2] = color[2]; pixels[offset + 3] = 255
  }
}
const svgRects = []
const svgPixel = (x, y, w, h, c) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`
function frameSvg(sprite, frame) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${sprite.w * 2}" height="${sprite.h * 2}" viewBox="0 0 ${sprite.w} ${sprite.h}" shape-rendering="crispEdges">${frame.flatMap((row, y) => [...row].map((c, x) => c === '.' ? '' : svgPixel(x, y, 1, 1, PALETTE[c]))).join('')}</svg>`
}
const htmlRows = []
sprites.forEach(([name, sprite], index) => {
  const top = index * rowHeight
  backgrounds.forEach((bg, b) => {
    const left = [0, 720, 1080][b], panelWidth = b === 0 ? 720 : 360
    rect(left, top, panelWidth, rowHeight, bg)
    svgRects.push(svgPixel(left, top, panelWidth, rowHeight, bg))
    const shown = b === 0 ? sprite.frames : [sprite.frames[0]]
    shown.forEach((frame, f) => frame.forEach((row, y) => [...row].forEach((c, x) => {
      if (c === '.') return
      const xx = left + 12 + f * (sprite.w * scale + 8) + x * scale, yy = top + 12 + y * scale
      rect(xx, yy, scale, scale, PALETTE[c]); svgRects.push(svgPixel(xx, yy, scale, scale, PALETTE[c]))
    })))
  })
  svgRects.push(`<text x="12" y="${top + 108}" fill="#423e5c" font-family="monospace" font-size="12">${name}</text>`)
  htmlRows.push(`<article><h2>${name} <small>${sprite.w}×${sprite.h} · ${sprite.frames.length} frames</small></h2><div class="panels">${backgrounds.map(bg => `<section style="background:${bg}"><div class="animated" style="width:${sprite.w * 2}px;height:${sprite.h * 2}px">${sprite.frames.map((frame, i) => `<div class="frame" style="animation: cycle${sprite.frames.length} ${sprite.frames.length * .18}s steps(1) infinite;animation-delay:-${(sprite.frames.length - i) * .18}s">${frameSvg(sprite, frame)}</div>`).join('')}</div><div class="strip">${sprite.frames.map(frame => frameSvg(sprite, frame)).join('')}</div></section>`).join('')}</div></article>`)
})
// Minimal lossless RGBA PNG encoder; nearest-neighbour pixels, no antialiasing.
function crc32(buffer) {
  let crc = 0xffffffff
  for (const byte of buffer) {
    crc ^= byte
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0)
  }
  return (crc ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const name = Buffer.from(type), size = Buffer.alloc(4), crc = Buffer.alloc(4)
  size.writeUInt32BE(data.length); crc.writeUInt32BE(crc32(Buffer.concat([name, data])))
  return Buffer.concat([size, name, data, crc])
}
const ihdr = Buffer.alloc(13)
ihdr.writeUInt32BE(width); ihdr.writeUInt32BE(height, 4); ihdr[8] = 8; ihdr[9] = 6
const scanlines = Buffer.alloc(height * (width * 4 + 1))
for (let y = 0; y < height; y++) pixels.copy(scanlines, y * (width * 4 + 1) + 1, y * width * 4, (y + 1) * width * 4)
await writeFile(join(output, 'sprites.png'), Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(scanlines)), chunk('IEND', Buffer.alloc(0))]))
await writeFile(join(output, 'sprites.svg'), `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" shape-rendering="crispEdges">${svgRects.join('')}</svg>`)
await writeFile(join(output, 'index.html'), `<!doctype html><html lang="en"><meta charset="utf-8"><title>Dusk sprite review</title><style>body{margin:24px;background:#d9cfcf;color:#16152a;font:14px monospace}h1{font-size:20px}h2{font-size:14px}small{font-weight:normal}.panels{display:flex;gap:8px}section{padding:16px;flex:1;min-width:0}.strip{display:flex;gap:12px;align-items:center;margin-top:16px}svg{flex-shrink:0;image-rendering:pixelated}.animated{position:relative}.frame{position:absolute;inset:0}@keyframes cycle1{0%,100%{visibility:visible}}@keyframes cycle2{0%{visibility:visible}50%,100%{visibility:hidden}}@keyframes cycle4{0%{visibility:visible}25%,100%{visibility:hidden}}@media(prefers-reduced-motion:reduce){.frame{animation:none!important;visibility:hidden}.frame:first-child{visibility:visible}}</style><h1>Dusk pixel art · animated at 2× + individual frames</h1><p>Left: light page · middle: dark page · right: road / HUD. PNG and SVG contact sheets use 4×.</p>${htmlRows.join('')}</html>`)
console.log(`Validated ${sprites.length} sprites / ${sprites.reduce((n, [, s]) => n + s.frames.length, 0)} frames, palette and achievement ids.\nPreview: ${output}/index.html\nContact sheets: ${output}/sprites.{png,svg}`)
