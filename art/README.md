# Dusk PNG art sources

Hand-painted with integer-coordinate Pillow primitives. The car is a **convertible**, per the owner's updated request. The grid sprites are unchanged fallbacks.

```sh
python3 -m venv /tmp/portfolio-art-venv
/tmp/portfolio-art-venv/bin/pip install -r art/requirements.txt
/tmp/portfolio-art-venv/bin/python art/generate.py
/tmp/portfolio-art-venv/bin/python art/verify.py
```

`generate.py` redraws every PNG in `public/sprites/` at native resolution and regenerates `art/preview.html`. No source image, AI model, scaling, antialiasing, gradients or random texture is used. Palette ramps, individual pixel accents, silhouettes and animation parts are editable in the script. Generation is deterministic.

Open [preview.html](preview.html) in a browser to review animations and frame strips on light, dark and HUD backgrounds. Each PNG has at most 32 colours including transparent, and binary alpha. The optional 32×64 player is included as a four-frame idle strip; it is not wired into the site.

The validator reads the files from disk and verifies exact dimensions, PNG RGBA mode, colour count, alpha, achievement filenames, fixed car silhouette/body and tyre contact points, distinct wheel frames, stationary pigeon envelope, blank cartridge label and flag pole base.

## Integration note

The brief specifies a 72×52 pigeon. The current fallback is 24×16 and `GameHUD` renders it at scale 4, so `Sprite` currently stretches the PNG to **96×64**. The supplied PNG follows the brief's exact 72×52 size. Fixing its display box requires a component or fallback dimension change, which this art-only brief excludes. All other wired PNG sizes match their display boxes.

The visual reference sheet mentioned by the brief is not present in this repository; the art follows its written style guide: fine coloured outlines, muted Dusk ramps and top-left lighting.
