#!/usr/bin/env python3
"""Pixel-exact Dusk originals; no image models, rescaling, antialiasing or randomness.
Run: python3 art/generate.py (requires Pillow; see art/README.md).
"""
from pathlib import Path
import math
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'sprites'
PALETTE = {
 'night':'#16152a', 'violet':'#423e5c', 'shadow':'#565170', 'slate':'#6e6886',
 'metal':'#918aa3', 'stone':'#b9afbd', 'light':'#d9cfcf', 'cream':'#f7f2ec', 'paper':'#fdf9f4',
 'peach':'#f0a07c', 'peachh':'#f6ba9c', 'terra':'#c46850', 'terrad':'#a0503e',
 'teal':'#6fa3a0', 'teald':'#4f8582', 'tealh':'#a9cfc9',
 'blue':'#7fa7c9', 'blueh':'#a9c4e0', 'blued':'#3f6a8f',
 'gold':'#e9c46a', 'goldd':'#a07a1e', 'goldh':'#fff3c4', 'rose':'#d98a94',
 'lilac':'#a99bc9', 'plum':'#7d5a8c', 'sage':'#8aa86b', 'olive':'#6b7f4e',
 'skin':'#e8b996', 'skind':'#c98f6b',
}
SPECS = {}
class Canvas:
 def __init__(self,w,h): self.im=Image.new('RGBA',(w,h)); self.d=ImageDraw.Draw(self.im)
 def rect(self,box,c): self.d.rectangle(box,fill=PALETTE[c]); return self
 def poly(self,pts,c): self.d.polygon(pts,fill=PALETTE[c]); return self
 def line(self,pts,c,width=1): self.d.line(pts,fill=PALETTE[c],width=width); return self
 def oval(self,box,c): self.d.ellipse(box,fill=PALETTE[c]); return self
 def arc(self,box,start,end,c): self.d.arc(box,start,end,fill=PALETTE[c]); return self
 def dot(self,x,y,c): self.d.point((x,y),fill=PALETTE[c]); return self
 def round(self,box,r,c): self.d.rounded_rectangle(box,radius=r,fill=PALETTE[c]); return self

# Assets the site no longer uses (road, car, coins, flag, player, old badges): skipped.
RETIRED = {'car', 'flag-finish', 'sound-on', 'sound-off', 'achievements/chiptune', 'player', 'achievements/honk', 'achievements/coins',
           'achievements/road_trip', 'achievements/artist'}

def save(name, canvases):
 if name in RETIRED:
  return
 if not isinstance(canvases,list): canvases=[canvases]
 w,h=canvases[0].im.size
 strip=Image.new('RGBA',(w*len(canvases),h))
 for i,c in enumerate(canvases): strip.paste(c.im,(w*i,0))
 dest=OUT / (name+'.png'); dest.parent.mkdir(parents=True,exist_ok=True); strip.save(dest,optimize=True)
 SPECS[name]=[w,h,len(canvases)]

def convertible():
 c=Canvas(80,40)
 # Folded canvas roof behind the seats, thin headrests, open sky above the cabin.
 c.poly([(9,18),(14,15),(24,15),(28,19)],'violet')
 c.line([(12,17),(24,17),(27,19)],'slate')
 c.round((28,13,34,24),2,'terrad').rect((29,14,32,20),'terra')
 c.line([(29,14),(31,14)],'peachh')
 # Driver: two-pixel straight fringe, tiny eye/nose, denim pinstripes.
 c.poly([(36,6),(42,6),(45,9),(45,14),(43,17),(39,17),(37,14)],'skind')
 c.poly([(37,8),(42,8),(44,10),(44,13),(46,14),(43,15),(42,16),(39,15),(38,13)],'skin')
 c.poly([(36,7),(38,5),(42,5),(45,7),(45,10),(37,10),(37,13),(35,12)],'violet')
 c.rect((37,7,44,8),'night').rect((37,9,44,10),'night')
 c.line([(38,6),(42,6)],'shadow').dot(43,12,'night').dot(44,11,'cream')
 c.line([(42,15),(43,15)],'skind').rect((39,16,41,18),'skin')
 c.poly([(35,19),(39,17),(43,18),(47,22),(43,26),(33,25)],'blued')
 c.poly([(36,19),(39,18),(43,19),(45,23),(43,25),(34,24)],'blueh')
 for x in (36,39,42): c.line([(x,19),(x-1,24)],'blue')
 c.line([(44,21),(48,22),(50,20)],'skin',2).dot(49,20,'peachh')
 c.arc((48,17,54,24),180,350,'violet').line([(51,20),(53,25)],'slate')
 # Delicate windscreen frame, with lit edge left unoutlined.
 c.poly([(51,10),(53,10),(59,21),(56,21)],'teald')
 c.poly([(52,11),(57,20),(56,20),(52,14)],'tealh')
 c.line([(52,10),(58,20)],'light').line([(52,14),(54,17)],'cream')
 # Vintage roadster silhouette, short boot, long shallow bonnet.
 c.poly([(5,19),(11,17),(25,18),(29,22),(51,22),(57,19),(69,20),(75,23),(77,27),(77,31),(73,33),(8,33),(3,30),(3,23)],'terrad')
 c.poly([(5,20),(11,18),(24,19),(29,23),(51,23),(57,20),(68,21),(74,24),(75,29),(72,31),(8,31),(4,29),(4,23)],'peach')
 c.line([(5,20),(12,19),(23,20),(28,24),(51,24),(57,21),(68,22),(73,24)],'peachh')
 c.line([(7,26),(72,26)],'terra')
 c.poly([(5,28),(11,29),(70,29),(75,27),(74,31),(70,32),(9,32),(5,30)],'terra')
 c.line([(28,25),(29,29),(47,29),(50,25)],'terrad')
 c.line([(29,25),(29,28)],'peachh').rect((43,25,46,25),'terrad').dot(43,24,'cream')
 # One-pixel chrome trim, bumpers and lamps.
 c.line([(5,27),(13,27)],'light').line([(28,27),(51,27)],'light').line([(68,27),(75,27)],'light')
 c.rect((2,29,8,30),'metal').line([(2,29),(8,29)],'light')
 c.rect((72,29,78,30),'metal').line([(73,29),(78,29)],'light')
 c.line([(5,22),(5,24)],'rose').dot(6,22,'peachh')
 c.poly([(72,23),(75,24),(76,26),(73,26)],'gold').line([(73,23),(75,24)],'goldh')
 c.round((55,18,61,20),1,'teald').line([(56,18),(60,18)],'tealh').line([(58,20),(58,22)],'metal')
 # Wheel wells and tyre contact patches are identical in all frames.
 for x in (18,61):
  c.oval((x-9,24,x+9,39),'terrad')
  c.oval((x-8,25,x+8,39),'violet')
  c.arc((x-9,24,x+9,40),190,350,'peachh')
 frames=[]
 for phase in range(4):
  f=Canvas(80,40); f.im=c.im.copy(); f.d=ImageDraw.Draw(f.im)
  for x in (18,61):
   f.oval((x-7,25,x+7,39),'violet').arc((x-7,25,x+7,39),190,300,'shadow')
   f.oval((x-5,27,x+5,37),'slate').oval((x-4,28,x+4,36),'stone')
   f.arc((x-4,28,x+4,36),20,150,'metal')
   for spoke in range(5):
    angle=(spoke*72+phase*18)*math.pi/180
    xx=x+round(math.cos(angle)*4); yy=32+round(math.sin(angle)*4)
    f.line([(x,32),(xx,yy)],'slate')
    f.dot(xx,yy,'light')
   f.oval((x-1,31,x+1,33),'metal').dot(x,31,'cream')
  frames.append(f)
 return frames
save('car',convertible())

def coins():
 result=[]
 for i,rx in enumerate([6,4,1,4,6,4]):
  c=Canvas(16,16); l=7-rx; r=8+rx
  c.oval((l,0,r,15),'goldd').oval((l,0,r-1,14),'gold')
  c.arc((l,0,r-1,14),160,285,'goldh').arc((l+1,2,r,15),315,90,'terra')
  if rx>=4:
   c.oval((l+2,2,r-2,12),'goldd').oval((l+2,2,r-3,11),'gold')
   if i in (0,4):
    c.line([(5,5),(10,5)],'goldh').line([(7,5),(7,10)],'goldd').line([(8,6),(8,10)],'goldh')
   else: c.line([(7 if i<3 else 8,4),(7 if i<3 else 8,10)],'goldh')
  else: c.line([(7,2),(7,12)],'goldh')
  c.dot(l+2,2,'cream'); result.append(c)
 return result
save('coin',coins())

def envelope(c,x,y,w=22,h=12):
 c.poly([(x+1,y),(x+w-2,y),(x+w-1,y+1),(x+w-1,y+h-2),(x+w-2,y+h-1),(x,y+h-1),(x,y+1)],'metal')
 c.rect((x+1,y+1,x+w-2,y+h-2),'cream')
 c.line([(x+1,y+h-2),(x+w//2,y+3),(x+w-2,y+h-2)],'light')
 c.line([(x+1,y+1),(x+w//2,y+7),(x+w-2,y+1)],'stone')
 c.oval((x+w//2-2,y+5,x+w//2+2,y+9),'terra').dot(x+w//2-1,y+6,'rose')

def pigeons():
 result=[]
 wings=[[(29,29),(24,23),(20,15),(18,5),(21,1),(25,5),(29,12),(36,21),(41,28)],
        [(29,30),(19,27),(13,21),(12,17),(17,16),(26,20),(37,27),(41,31)],
        [(30,27),(38,28),(38,35),(32,43),(26,47),(22,45),(23,39),(27,33)],
        [(29,29),(21,27),(15,23),(13,20),(17,19),(26,22),(38,27),(41,31)]]
 for phase,wing in enumerate(wings):
  c=Canvas(72,52)
  c.poly([(24,29),(9,25),(1,27),(6,31),(2,33),(17,34),(30,33)],'shadow')
  c.line([(4,28),(18,30)],'stone').line([(6,32),(19,32)],'slate')
  c.oval((19,23,53,38),'shadow').oval((21,23,52,36),'stone')
  c.poly([(24,26),(40,25),(49,30),(44,35),(27,33)],'metal')
  c.line([(23,27),(35,25),(42,26)],'light')
  c.poly([(44,29),(49,20),(50,14),(57,11),(63,14),(63,23),(58,26),(55,34),(48,36)],'slate')
  c.oval((50,12,63,24),'metal').oval((51,12,62,22),'stone')
  c.poly([(49,23),(55,26),(59,24),(56,31),(52,33),(47,31)],'teald')
  c.line([(50,24),(54,27),(57,26)],'teal').line([(50,26),(54,29)],'lilac')
  c.poly([(49,32),(54,30),(56,28),(54,35),(48,37),(43,36)],'light')
  c.oval((58,16,61,19),'goldd').dot(59,17,'goldh').dot(60,17,'violet')
  c.poly([(63,19),(68,21),(63,22),(61,21)],'goldd').line([(63,20),(67,21)],'gold')
  c.poly(wing,'shadow')
  inset=[(round(x*.9+3.5),round(y*.9+2.8)) for x,y in wing]
  c.poly(inset,'metal')
  if phase==0:
   c.line([(22,5),(26,15),(33,25)],'light').line([(21,11),(25,20),(31,27)],'stone')
   c.line([(25,9),(29,17),(35,24)],'slate')
  elif phase==2:
   c.line([(31,31),(28,38),(25,44)],'light').line([(34,32),(31,40)],'stone')
  else:
   c.line([(17,20+phase//3),(24,24),(34,29)],'light').line([(20,24),(29,28)],'stone')
  c.line([(45,36),(46,41),(50,42)],'skind').line([(52,36),(54,41),(58,42)],'skind')
  envelope(c,42,40,25,12)
  # Feet clasp the top edge without disturbing the wax seal.
  c.line([(48,39),(48,41),(51,41)],'goldd').line([(57,39),(57,41),(60,41)],'goldd')
  result.append(c)
 return result
save('pigeon',pigeons())

c=Canvas(18,18)
for i in range(8):
 a=i*math.pi/4
 c.line([(round(8.5+6.5*math.cos(a)),round(8.5+6.5*math.sin(a))),(round(8.5+8.5*math.cos(a)),round(8.5+8.5*math.sin(a)))],'gold')
c.oval((4,4,13,13),'goldd').oval((4,4,12,12),'gold').arc((4,4,12,12),170,280,'goldh').dot(6,6,'cream')
save('sun',c)
c=Canvas(18,18)
c.poly([(11,1),(7,1),(4,3),(2,6),(2,11),(5,15),(9,16),(13,15),(15,12),(11,13),(8,12),(6,9),(6,6),(8,3)],'plum')
c.poly([(10,1),(7,2),(4,5),(3,8),(4,12),(7,14),(11,15),(14,13),(10,13),(7,11),(5,8),(6,4)],'gold')
c.line([(7,2),(5,4),(4,7)],'goldh')
c.line([(14,2),(14,6)],'goldd').line([(12,4),(16,4)],'goldd').dot(11,8,'plum')
save('moon',c)
c=Canvas(18,18).poly([(4,1),(13,1),(12,8),(10,10),(10,13),(13,14),(14,17),(3,17),(4,14),(7,13),(7,10),(5,8)],'goldd')
c.poly([(5,2),(12,2),(11,7),(9,9),(7,8),(6,6)],'gold').line([(5,2),(5,5),(6,7)],'goldh')
c.line([(4,3),(1,3),(1,6),(3,8),(5,8)],'gold').line([(13,3),(16,3),(16,6),(14,8),(12,8)],'gold')
c.rect((8,9,9,13),'gold').line([(5,15),(12,15)],'goldh').rect((4,16,13,16),'gold')
save('trophy',c)
def speaker():
 c=Canvas(18,18).poly([(2,6),(5,6),(9,2),(10,2),(10,15),(9,15),(5,11),(2,11)],'blued')
 c.poly([(3,7),(6,7),(9,4),(9,13),(6,10),(3,10)],'teal').line([(3,6),(5,6),(8,3)],'tealh')
 return c
c=speaker().arc((7,4,14,13),290,70,'stone').arc((7,1,17,16),300,60,'tealh'); save('sound-on',c)
c=speaker().line([(12,6),(16,10)],'rose').line([(12,10),(16,6)],'rose'); save('sound-off',c)
c=Canvas(16,20).line([(2,1),(2,19)],'metal').line([(3,1),(3,19)],'light')
c.poly([(4,1),(10,1),(15,3),(15,12),(10,10),(4,10)],'shadow')
for yy in range(3):
 for xx in range(4):
  if (xx+yy)%2==0:
   x=4+xx*3; y=2+yy*3+(1 if xx>=2 else 0); c.rect((x,y,min(14,x+2),y+2),'cream')
c.line([(1,19),(5,19)],'stone'); save('flag-finish',c)

# Plastic cartridge: broad blank label, no texture or glyph inside title bounds.
c=Canvas(192,144)
c.poly([(13,1),(178,1),(188,10),(188,126),(178,134),(14,134),(4,126),(4,10)],'shadow')
c.poly([(14,3),(177,3),(185,11),(185,124),(176,130),(15,130),(7,124),(7,12)],'metal')
c.poly([(16,5),(175,5),(183,13),(183,122),(175,127),(16,127),(9,122),(9,13)],'stone')
c.line([(16,5),(175,5),(181,11)],'light').line([(10,14),(10,120)],'light')
c.line([(183,14),(183,122),(175,127),(18,127)],'slate')
c.rect((20,26,171,94),'slate').rect((22,28,169,92),'light').rect((24,30,167,89),'cream')
c.line([(24,90),(167,90)],'metal')
for x in (15,176):
 for y in (16,116):
  c.oval((x-3,y-3,x+3,y+3),'metal').oval((x-2,y-2,x+2,y+2),'light')
  c.line([(x-1,y+1),(x+1,y-1)],'slate')
# Fine moulded ribs and recessed grip, outside label.
for y in (11,14,17): c.line([(29,y),(162,y)],'metal').line([(30,y-1),(161,y-1)],'light')
c.round((26,101,165,120),3,'metal').round((28,103,163,118),2,'stone')
for x in range(36,158,5): c.line([(x,106),(x,115)],'metal').line([(x+1,106),(x+1,115)],'light')
c.rect((28,131,163,143),'violet').rect((32,133,159,143),'shadow')
for x in range(35,158,8):
 c.rect((x,134,x+4,143),'goldd').rect((x,134,x+3,141),'gold').line([(x,134),(x+3,134)],'goldh')
save('cartridge',c)

def cloud(flat=False):
 c=Canvas(96,40)
 if not flat:
  pts=[(2,29),(6,23),(15,22),(18,16),(29,16),(34,8),(45,5),(53,7),(60,14),(70,14),(77,20),(87,22),(93,28),(91,33),(81,35),(14,35),(5,33)]
 else:
  pts=[(1,28),(10,24),(20,24),(26,18),(36,16),(46,18),(51,22),(65,20),(72,23),(81,24),(89,28),(95,30),(89,33),(67,33),(52,32),(39,34),(20,32),(7,32)]
 c.poly(pts,'lilac')
 c.poly([(x,y-2 if y>26 else y) for x,y in pts],'light')
 c.poly([(x,y-4 if y>24 else y) for x,y in pts],'cream')
 if not flat:
  c.line([(35,9),(43,6),(49,7)],'paper').line([(8,25),(16,24)],'paper').line([(21,33),(40,34),(53,33)],'peachh')
 else: c.line([(27,19),(35,17),(42,18)],'paper').line([(51,31),(69,31),(79,32)],'peachh')
 return c
save('cloud-a',cloud()); save('cloud-b',cloud(True))
bs=[]
for phase in range(4):
 c=Canvas(14,10).line([(6,5),(8,5),(9,6)],'violet').dot(9,5,'violet')
 wings=[([(6,5),(4,3),(3,0)],[(8,5),(10,3),(12,1)]), ([(6,5),(3,4),(0,3)],[(8,5),(11,4),(13,3)]), ([(6,5),(4,7),(3,9)],[(8,5),(10,7),(12,8)]), ([(6,5),(3,5),(0,4)],[(8,5),(11,5),(13,4)])][phase]
 for line in wings: c.line(line,'violet')
 bs.append(c)
save('bird',bs)

# Consistent 32px brushed-metal medallions; glyphs are newly drawn at native size.
def badge():
 c=Canvas(32,32)
 c.poly([(10,0),(21,0),(27,4),(31,10),(31,21),(27,27),(21,31),(10,31),(4,27),(0,21),(0,10),(4,4)],'shadow')
 c.oval((1,1,30,30),'metal').oval((2,2,29,29),'light').oval((4,4,28,28),'slate').oval((4,4,27,27),'stone')
 c.arc((2,2,29,29),180,285,'cream').arc((2,2,29,29),0,95,'shadow')
 c.arc((5,5,27,27),20,120,'metal').dot(6,5,'paper').dot(25,26,'lilac')
 return c

def gamepad(c):
 c.poly([(9,10),(22,10),(25,13),(27,22),(25,24),(21,23),(19,20),(12,20),(9,23),(6,23),(5,20),(7,13)],'blued')
 c.poly([(9,11),(21,11),(24,14),(25,21),(23,22),(20,18),(11,18),(8,21),(7,20),(9,13)],'teal')
 c.line([(10,11),(20,11)],'tealh').rect((10,13,11,18),'violet').rect((8,15,13,16),'violet')
 c.oval((20,13,22,15),'rose').oval((23,16,25,18),'gold').rect((15,16,17,16),'cream')
c=badge(); gamepad(c); save('achievements/press_start',c)
c=badge().rect((15,8,17,21),'blued').poly([(15,8),(23,6),(23,11),(17,13)],'blued')
c.oval((9,19,17,24),'blued').arc((6,11,12,21),110,245,'teald').line([(7,9),(10,6)],'teald').dot(19,7,'tealh')
save('achievements/chiptune',c)
c=badge().poly([(9,8),(13,11),(19,11),(23,8),(24,21),(21,25),(11,25),(8,21)],'plum')
c.oval((10,12,16,19),'cream').oval((17,12,23,19),'cream').oval((12,14,14,17),'violet').oval((19,14,21,17),'violet')
c.poly([(15,18),(18,18),(16,21)],'gold').line([(12,22),(14,23)],'lilac').line([(19,23),(21,22)],'lilac')
save('achievements/night_owl',c)
# Tiny Latin A and breve in the second bubble.
c=badge().round((5,7,20,19),2,'shadow').rect((6,8,19,17),'cream').poly([(8,17),(8,22),(12,18)],'cream')
c.round((15,15,27,25),2,'blued').rect((16,16,26,23),'tealh').poly([(23,23),(25,27),(25,23)],'tealh')
c.line([(9,15),(9,12),(11,10),(13,12),(13,15)],'shadow').line([(9,13),(13,13)],'shadow')
c.line([(19,22),(19,19),(21,17),(23,19),(23,22)],'blued').line([(19,20),(23,20)],'blued')
c.line([(20,15),(21,16),(22,15)],'blued'); save('achievements/polyglot',c)
c=badge().poly([(11,8),(21,8),(25,15),(25,24),(7,24),(7,15)],'terrad')
c.poly([(12,9),(20,9),(23,15),(9,15)],'teal').line([(13,10),(18,10)],'tealh')
c.rect((8,16,24,22),'peach').line([(9,16),(23,16)],'peachh').rect((10,19,12,20),'goldh').rect((21,19,23,20),'goldh')
c.rect((14,20,19,21),'terrad').line([(8,23),(24,23)],'light').rect((9,24,11,26),'violet').rect((21,24,23,26),'violet'); save('achievements/honk',c)
c=badge()
for x,y in [(15,9),(14,13),(7,19)]:
 c.round((x,y,x+11,y+6),2,'goldd').rect((x+1,y+1,x+10,y+3),'gold').oval((x,y-2,x+11,y+2),'goldd').oval((x,y-2,x+10,y+1),'gold')
 c.line([(x+2,y-1),(x+6,y-1)],'goldh').dot(x+3,y+3,'goldh')
save('achievements/coins',c)
c=badge().line([(8,7),(8,26)],'shadow').line([(9,7),(9,26)],'light')
c.poly([(10,7),(17,7),(24,10),(24,21),(17,18),(10,18)],'shadow')
for y in range(3):
 for x in range(4):
  if (x+y)%2==0:
   xx=10+x*3; yy=8+y*3+(2 if x>1 else 0); c.rect((xx,yy,xx+2,yy+2),'cream')
save('achievements/road_trip',c)
c=badge().poly([(5,10),(12,7),(20,10),(27,7),(27,23),(20,26),(12,23),(5,26)],'teald')
c.poly([(6,11),(12,8),(12,22),(6,24)],'tealh').poly([(13,8),(19,11),(19,24),(13,22)],'teal').poly([(20,11),(26,8),(26,22),(20,24)],'tealh')
for x,y in [(8,19),(10,16),(13,16),(16,19),(19,18)]: c.dot(x,y,'blued')
c.line([(21,12),(24,15)],'terra').line([(21,15),(24,12)],'terra'); save('achievements/world_map',c)
def mini_cart(c,x,y,w=15,h=18):
 c.round((x,y,x+w-1,y+h-1),1,'shadow').rect((x+1,y+1,x+w-2,y+h-2),'metal')
 c.rect((x+3,y+3,x+w-4,y+8),'cream').line([(x+3,y+11),(x+w-4,y+11)],'slate')
 for xx in range(x+3,x+w-2,3): c.rect((xx,y+h-3,xx+1,y+h-1),'gold')
c=badge(); mini_cart(c,9,7); save('achievements/curious',c)
c=badge()
for x,col in [(6,'terra'),(13,'teald'),(20,'plum')]:
 c.round((x,9,x+5,23),1,'shadow').rect((x+1,10,x+4,22),col).rect((x+1,12,x+4,16),'cream')
 c.dot(x+2,20,'gold')
c.rect((5,24,26,25),'goldd').line([(5,24),(26,24)],'gold'); save('achievements/completionist',c)
c=badge().poly([(9,9),(15,6),(22,8),(25,13),(23,17),(18,17),(17,20),(20,23),(17,26),(11,25),(7,20),(6,14)],'goldd')
c.poly([(9,10),(15,7),(21,9),(24,13),(22,16),(17,16),(15,20),(18,23),(16,25),(11,24),(8,19),(7,14)],'cream')
for x,y,col in [(10,11,'rose'),(16,9,'blue'),(9,17,'teal'),(12,21,'peach')]: c.oval((x,y,x+3,y+3),col)
c.oval((18,12,21,15),'shadow').line([(18,24),(25,10)],'terrad',2).line([(20,20),(24,12)],'gold').poly([(24,11),(25,7),(27,6),(27,10)],'teald'); save('achievements/artist',c)
c=badge().poly([(5,15),(9,12),(13,14),(20,9),(24,10),(25,13),(23,16),(19,16),(16,20),(9,20)],'shadow')
c.poly([(9,14),(13,15),(19,11),(22,11),(23,13),(20,14),(17,18),(10,18)],'light').dot(22,11,'violet')
c.poly([(12,15),(10,8),(12,5),(17,14)],'metal').line([(12,8),(15,14)],'cream').dot(25,12,'gold')
envelope(c,13,21,13,7); c.line([(18,18),(19,21)],'goldd'); save('achievements/messenger',c)

# Optional slender owner villager: fixed shoes and body, subtle blink and hand idle.
players=[]
for phase in range(4):
 c=Canvas(32,64)
 c.poly([(11,9),(12,4),(17,2),(22,5),(23,10),(21,16),(15,17),(12,14)],'skind')
 c.poly([(13,6),(19,5),(22,8),(21,14),(18,16),(14,14)],'skin')
 c.poly([(11,7),(12,3),(17,1),(22,3),(24,7),(23,10),(21,8),(12,8),(12,11),(10,10)],'violet').rect((12,5,22,8),'night').line([(13,3),(19,2),(22,4)],'shadow')
 c.dot(15,10,'violet').dot(20,10,'violet')
 if phase==2: c.line([(14,11),(16,11)],'skind').line([(19,11),(21,11)],'skind')
 c.line([(17,14),(19,14)],'skind').rect((16,16,19,19),'skin')
 c.poly([(12,19),(16,18),(19,18),(23,20),(25,29),(22,30),(21,38),(12,38),(11,29),(8,28),(9,22)],'blued')
 c.poly([(12,20),(16,19),(19,20),(22,21),(23,27),(20,28),(20,36),(13,36),(12,27),(10,27),(11,22)],'blueh')
 for x in (13,16,19): c.line([(x,21),(x,35)],'blue')
 c.line([(17,20),(17,34)],'cream').dot(18,24,'metal').dot(18,29,'metal')
 c.line([(10,29),(10,37),(12,41 if phase!=1 else 40)],'skind',2).line([(23,30),(23,37),(22,41)],'skind',2)
 c.line([(10,30),(10,36)],'skin').line([(23,31),(23,36)],'skin')
 c.poly([(12,37),(21,37),(22,43),(21,59),(17,59),(16,45),(15,59),(11,59)],'violet')
 c.line([(13,40),(12,56)],'shadow').line([(19,40),(20,56)],'shadow').line([(16,39),(16,44)],'night')
 c.round((9,58,15,62),1,'slate').round((18,58,24,62),1,'slate').line([(9,63),(15,63)],'cream').line([(18,63),(25,63)],'cream').dot(12,59,'light').dot(21,59,'light')
 players.append(c)
save('player',players)

# Review only: show native-size animation + individual frames on all target grounds.
preview=ROOT/'art'/'preview.html'
rows=[]
for name,(w,h,n) in SPECS.items():
 panels=[]
 for bg in ['#f6efe7','#1c1b2e','#16152a']:
  panels.append(f'<div class="panel" style="background:{bg}"><div class="anim" style="width:{w}px;height:{h}px;background-image:url(../public/sprites/{name}.png);background-size:{w*n}px {h}px;--shift:-{w*n}px;animation:spin {n*.15}s steps({n}) infinite"></div><img src="../public/sprites/{name}.png" width="{w*n}" height="{h}" alt="{name} frames"></div>')
 rows.append(f'<article><h2>{name} · {w}×{h} × {n}</h2><section>{"".join(panels)}</section></article>')
preview.write_text('<!doctype html><html lang="en"><meta charset="utf-8"><title>Dusk PNG originals</title><style>body{font:13px monospace;background:#d9cfcf;color:#423e5c;margin:24px}h1{font-size:20px}h2{font-size:13px}section{display:flex;gap:8px}.panel{flex:1;min-width:0;overflow:auto;padding:16px;display:flex;flex-direction:column;gap:16px}img,.anim{image-rendering:pixelated;flex-shrink:0}img{max-width:none}@keyframes spin{to{background-position:var(--shift) 0}}@media(prefers-reduced-motion:reduce){.anim{animation:none!important}}</style><h1>Dusk · native-resolution pixel paintings</h1><p>1 art pixel = 1 CSS pixel. Light page / dark page / road. Open images separately to zoom with nearest-neighbour.</p>'+''.join(rows)+'</html>')
print(f'Exported {len(SPECS)} original RGBA strips to {OUT}; preview: {preview}')
