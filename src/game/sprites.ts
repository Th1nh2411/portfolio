/**
 * Hand-drawn Dusk pixel art. One character = one opaque pixel; '.' = transparent.
 * Light falls from the top-left. Car frames change only the wheel hubs.
 * Validate and preview: node scripts/sprites/preview.mjs
 */
export const PALETTE: Record<string, string> = {
  E: '#a07a1e',
  P: '#7d7590',
  b: '#f0a07c',
  c: '#c46850',
  d: '#2f2c47',
  e: '#e9c46a',
  f: '#e8b996',
  g: '#6fa3a0',
  h: '#f6ba9c',
  k: '#423e5c',
  l: '#fff3c4',
  m: '#918aa3',
  n: '#fdf9f4',
  o: '#16152a',
  p: '#b9afbd',
  r: '#d98a94',
  s: '#c46850',
  t: '#a9c4e0',
  w: '#a9cfc9',
  x: '#6e6886',
  y: '#ffe9a8',
}

export interface SpriteDef {
  w: number
  h: number
  frames: string[][]
}

export const PIGEON: SpriteDef = {
  w: 24,
  h: 16,
  frames: [
    [
      '.......oo...............',
      '......onpo..............',
      '......onppo.............',
      '.......opppo............',
      '........opppo....oooo...',
      '.........oPPPo..oppppo..',
      '..........oPPPoopnopppeo',
      '.....oooooooooooppppooo.',
      '.ooooopppppppppogggpo...',
      'oPPPPpppppppppPognno....',
      '.oooooPPPPPPPPPoonno....',
      '......ooooooooooeooe....',
      '.............oooooooo...',
      '.............onpnnnno...',
      '.............onnccnno...',
      '..............oooooo....',
    ],
    [
      '........................',
      '........................',
      '........................',
      '........................',
      '.................oooo...',
      '................oppppo..',
      '...............opnopppeo',
      '.....oooooooooooppppooo.',
      '.ooooopooooooppogggpo...',
      'oPPPPppopppPPoPognno....',
      '.oooooPopppPPoPoonno....',
      '......ooopPPPoooeooe....',
      '.........oPPooooooooo...',
      '..........oo.onpnnnno...',
      '.............onnccnno...',
      '..............oooooo....',
    ],
  ],
}

export const SUN: SpriteDef = {
  w: 9,
  h: 9,
  frames: [
    [
      '....e....',
      '.e..o..e.',
      '..ooeoo..',
      '..oleEo..',
      'eoeeeeooe',
      '..oeEEo..',
      '..ooEoo..',
      '.e..o..e.',
      '....e....',
    ],
  ],
}

export const MOON: SpriteDef = {
  w: 9,
  h: 9,
  frames: [
    [
      '...oooo..',
      '..olEo...',
      '.oleo....',
      'oleEo....',
      'oleEo..o.',
      'oleEo....',
      '.oleEooo.',
      '..oEEEo..',
      '...ooo...',
    ],
  ],
}

/** Filled metal medals remain readable on the dark HUD. */
export const ACHIEVEMENT_ICONS: Record<string, SpriteDef> = {
  press_start: {
    w: 16,
    h: 16,
    frames: [
      [
        '....oooooooo....',
        '..ooppppppppoo..',
        '.opnnnnnnnnnPpo.',
        '.oppppppppppPPo.',
        'opnpppppppppPPPo',
        'oppppoooooopPPPo',
        'opppoggggggoPPPo',
        'oppoggggggggoPPo',
        'oppogoggggrgoPPo',
        'oppooogggogooPPo',
        'oppogoggggggoPPo',
        'opppooppppooPPPo',
        '.oPPPPPPPPPPPPo.',
        '.opPPPPPPPPPPro.',
        '..ooPPPPPPPPoo..',
        '....oooooooo....',
      ],
    ],
  },
  night_owl: {
    w: 16,
    h: 16,
    frames: [
      [
        '....oooooooo....',
        '..ooppppppppoo..',
        '.opnnnnnnnnnPpo.',
        '.oppppppppppPPo.',
        'opnpopppppopPPPo',
        'oppogooooogoPPPo',
        'oppogggggggoPPPo',
        'oppogloglogoPPPo',
        'oppogooeoogoPPPo',
        'opppoggEggopPPPo',
        'oppppoggopppPPPo',
        'opppppooopppPPPo',
        '.oPPPPPPPPPPPPo.',
        '.opPPPPPPPPPPro.',
        '..ooPPPPPPPPoo..',
        '....oooooooo....',
      ],
    ],
  },
  polyglot: {
    w: 16,
    h: 16,
    frames: [
      [
        '....oooooooo....',
        '..ooppppppppoo..',
        '.opnnnnnnnnnPpo.',
        '.opoooooooppPPo.',
        'opnonnnnnoppPPPo',
        'opponooonooooPPo',
        'opponononoggoPPo',
        'opponooonooooPPo',
        'opponononoogoPPo',
        'oppoooonooogoPPo',
        'oppppoggggggoPPo',
        'oppppooooogooPPo',
        '.oPPPPPPPPooPPo.',
        '.opPPPPPPPPPPro.',
        '..ooPPPPPPPPoo..',
        '....oooooooo....',
      ],
    ],
  },
  world_map: {
    w: 16,
    h: 16,
    frames: [
      [
        '....oooooooo....',
        '..ooppppppppoo..',
        '.opnnnnnnnnnPpo.',
        '.opppooppoopPPo.',
        'opnoogwoogwooPPo',
        'oppowggowgggoPPo',
        'oppowggowoggoPPo',
        'oppowogowospsPPo',
        'oppowggowgpspPPo',
        'oppowggowospsPPo',
        'oppowggowgggoPPo',
        'opppoooppoooPPPo',
        '.oPPPPPPPPPPPPo.',
        '.opPPPPPPPPPPro.',
        '..ooPPPPPPPPoo..',
        '....oooooooo....',
      ],
    ],
  },
  curious: {
    w: 16,
    h: 16,
    frames: [
      [
        '....oooooooo....',
        '..ooppppppppoo..',
        '.opnnnnnnnnnPpo.',
        '.oppooooooooPPo.',
        'opnokkkkkkkkoPPo',
        'oppokonnnnokoPPo',
        'oppokonnnnokoPPo',
        'oppokooooookoPPo',
        'oppokkkkxkkkoPPo',
        'oppokkkkxkkkoPPo',
        'oppokoeEEeokoPPo',
        'opppooooooooPPPo',
        '.oPPPPPPPPPPPPo.',
        '.opPPPPPPPPPPro.',
        '..ooPPPPPPPPoo..',
        '....oooooooo....',
      ],
    ],
  },
  completionist: {
    w: 16,
    h: 16,
    frames: [
      [
        '....oooooooo....',
        '..ooppppppppoo..',
        '.opnnnnnnnnnPpo.',
        '.opooooooooooPo.',
        'opnokkkxkkkkoPPo',
        'oppokrrxgggkoPPo',
        'oppokrrxgggkoPPo',
        'oppoknnxnnnkoPPo',
        'oppokrrxgggkoPPo',
        'oppokrrxgggkoPPo',
        'oppokkkxkkkkoPPo',
        'oppoeeeeeeeeoPPo',
        '.oPPPPPPPPPPPPo.',
        '.opPPPPPPPPPPro.',
        '..ooPPPPPPPPoo..',
        '....oooooooo....',
      ],
    ],
  },
  messenger: {
    w: 16,
    h: 16,
    frames: [
      [
        '....oooooooo....',
        '..ooppppppppoo..',
        '.opnnnnnnnnnPpo.',
        '.oppppppppppPPo.',
        'opnpppppppppPPPo',
        'opppooooooooPPPo',
        'opponnnnnnnnoPPo',
        'oppononnnnonoPPo',
        'opponnonnonnoPPo',
        'opponnnccnnnoPPo',
        'opponnnccnnnoPPo',
        'opppooooooooPPPo',
        '.oPPPPPPPPPPPPo.',
        '.opPPPPPPPPPPro.',
        '..ooPPPPPPPPoo..',
        '....oooooooo....',
      ],
    ],
  },
}

/** Phase two: art exports ready for component wiring. */
export const CARTRIDGE: SpriteDef = {
  w: 32,
  h: 24,
  frames: [
    [
      '..oooooooooooooooooooooooooooo..',
      '.oxxxxxxxxxxxxxxxxxxxxxxxxxxxxo.',
      'oxppppppppppppppppppppppppppppxo',
      'oxppppppppppppppppppppppppppppxo',
      'oxpoooooooooooooooooooooooooopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxponnnnnnnnnnnnnnnnnnnnnnnnopxo',
      'oxpoooooooooooooooooooooooooopxo',
      'oxppppppppppppppppppppppppppppxo',
      'oxpkkkkkkkkkkkkkkkkkkkkkkkkkkpxo',
      'oxpkmmmmmmmmmmmmmmmmmmmmmmmmkpxo',
      'oxxkkkkkkkkkkkkkkkkkkkkkkkkkkxxo',
      'oooooooooooooooooooooooooooooooo',
      '.oooooleoleoleoleoleoleoleooooo.',
      '.....oeEoeEoeEoeEoeEoeEoeEo.....',
      '.....oooooooooooooooooooooo.....',
    ],
  ],
}

export const TROPHY: SpriteDef = {
  w: 9,
  h: 9,
  frames: [
    [
      '..ooooo..',
      'ooleeeEoo',
      'oleeeeEeo',
      'oEoeeeooE',
      '.ooEEoo..',
      '...oEo...',
      '...oEo...',
      '..oleEo..',
      '.ooooooo.',
    ],
  ],
}

export const CLOUD_A: SpriteDef = {
  w: 24,
  h: 10,
  frames: [
    [
      '........................',
      '........oooooo..........',
      '......oownnnnnoo........',
      '.....ownnnnnnnnno.......',
      '..oooownnnnnnnnnnoooo...',
      '.ownnnnnnnnnnnnnnnnnno..',
      'ownnnnnnnnnnnnnnnnnnnno.',
      'owwwwwwwwwwwwwwwwwwwwwwo',
      '.oooooooooooooooooooooo.',
      '........................',
    ],
  ],
}

export const CLOUD_B: SpriteDef = {
  w: 24,
  h: 10,
  frames: [
    [
      '........................',
      '.....oooo...............',
      '....ownnno...oooo.......',
      '...ownnnnnooownnno......',
      '..ownnnnnnnnnnnnnnooo...',
      '.ownnnnnnnnnnnnnnnnnno..',
      'ownnnnnnnnnnnnnnnnnnnno.',
      'owwwwwwwwwwwwwwwwwwwwwwo',
      '.oooooooooooooooooooooo.',
      '........................',
    ],
  ],
}

export const BIRD: SpriteDef = {
  w: 7,
  h: 5,
  frames: [
    [
      'o.....o',
      'wo...ow',
      '.wo.ow.',
      '..ooo..',
      '...o...',
    ],
    [
      '.......',
      '...o...',
      '..ooo..',
      '.wo.ow.',
      'wo...ow',
    ],
  ],
}

