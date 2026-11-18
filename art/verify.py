#!/usr/bin/env python3
"""Validate the actual exported PNGs, independently of the generator."""
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SPRITES = ROOT / 'public' / 'sprites'
SPECS = {
 'coin':(16,16,6), 'pigeon':(72,52,4),
 'sun':(18,18,1), 'moon':(18,18,1), 'trophy':(18,18,1),
 'sound-on':(18,18,1), 'sound-off':(18,18,1),
 'cartridge':(192,144,1), 'cloud-a':(96,40,1), 'cloud-b':(96,40,1), 'bird':(14,10,4),
}
# Painted badges. lever / power_cycle / full_power have no art yet (emoji fallback).
IDS = ('press_start','chiptune','night_owl','polyglot','world_map','curious','completionist','messenger')
SPECS.update({f'achievements/{key}':(32,32,1) for key in IDS})
images={}
for name,(w,h,n) in SPECS.items():
 path=SPRITES/(name+'.png')
 with Image.open(path) as im:
  assert im.format=='PNG' and im.mode=='RGBA', f'{name}: expected PNG RGBA'
  assert im.size==(w*n,h), f'{name}: dimensions {im.size} != {(w*n,h)}'
  colors=im.getcolors(im.width*im.height)
  assert colors is not None and len(colors)<=32, f'{name}: {len(colors or [])} colours (max 32 including transparent)'
  assert all(color[3] in (0,255) for _,color in colors), f'{name}: translucent pixels'
  assert all(color[:3]!=(0,0,0) for _,color in colors if color[3]), f'{name}: pure black'
  images[name]=im.copy()
  print(f'{name:28} {w*n:3}×{h:<3} {n} frame(s) {len(colors):2} colours')
assert {p.stem for p in (SPRITES/'achievements').glob('*.png')}==set(IDS), 'Unexpected/missing achievement ids'
pigeon=images['pigeon']
assert len({pigeon.crop((i*72+42,40,i*72+67,52)).tobytes() for i in range(4)})==1, 'Envelope moves during wingbeat'
label=images['cartridge'].crop((24,30,168,90))
assert label.getcolors(label.width*label.height)==[(144*60,(247,242,236,255))], 'Label must be blank cream'
assert images['sound-on'].crop((0,0,11,18)).tobytes()==images['sound-off'].crop((0,0,11,18)).tobytes(), 'Speaker bodies differ'
print(f'PASS: {len(images)} PNG strips, sizes, binary alpha, <=32 colours, letter anchor and blank label.')
