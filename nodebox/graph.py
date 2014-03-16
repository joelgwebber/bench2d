# A quick hack to render graphs using NodeBox.
import math

FWIDTH = 1000
FHEIGHT = 500
HWIDTH = FWIDTH/2
HHEIGHT = FHEIGHT/2
BORDER_SIZE = 16
BOXHEIGHT = 24
LINEHEIGHT = 32

# [[name, mean, 5th %ile, 95th %ile, row-offset hack to make it look nice]]
DATA = [
  ["C", 2.14 , 1.89 , 2.41, 6],
  ["pNaCl", 2.61 , 2.31 , 2.92 , 5],
  ["asm.js (FF 27)", 3.24 , 3.00 , 4.00 , 4],
  ["Crossbridge", 5.16 , 4.16 , 7.81, 3],
  ["asm.js (Cr 33)", 5.43 , 4.00 , 6.00 , 2],
  ["Java", 5.71 , 5.00 , 6.00 , 1],
  ["AS3", 8.15 , 7.00 , 9.00 , 0],
  ["asm.js (IE11)", 9.54 , 7.00 , 12.0 , -1],
  ["Dart VM", 10.8 , 9.00 , 14.0 , -2],
  ["Box2dWeb (Firefox 27)", 10.9 , 10.00 , 11.0 , -3],
  ["Box2Web (Chrome 33)", 14.5 , 12.0 , 18.0 , -4],
  ["Box2dWeb (Safari 7)", 15.5 , 13.0 , 19.0 , -5],
  ["Box2dWeb (IE 11)", 15.6 , 13.0 , 21.0 , -6],
#  ["Dart2js (Chrome 33)", 30.6 , 26.0 , 35.0 , 0],
#  ["asm.js (Safari 7)", 272, 240, 309, 0],
]

BASELINE = DATA[0][1]
RANGE = 17.0
STEP = 1

def computeRange():
    max = 0
    for i in range(len(DATA)):
        val = DATA[i][3] / BASELINE
        if val > max:
            max = val
    return max

def scale(x):
    return x / RANGE * FWIDTH

def interval(name, mean, _5th, _95th, textLine):
    # interval box
    nostroke()
    fill(0, 0, 1, 0.5)
    strokewidth(2)

    x = scale(mean) / BASELINE
    left = scale(_5th) / BASELINE
    right = scale(_95th) / BASELINE
    top = HHEIGHT - BOXHEIGHT/2 + LINEHEIGHT*textLine
    rect(left, top, right - left, BOXHEIGHT)

    # mean line
    stroke(1, 1, 1, 1)
    line(x, top, x, top + BOXHEIGHT)
    font("Helvetica Bold", 14)

    # label
    fill(0, 0, 1, 1)
    w = textwidth(name)
    text(name, x - w/2, HHEIGHT + LINEHEIGHT*textLine + 4)

def renderIntervals():
    for i in range(len(DATA)):
        item = DATA[i]
        interval(item[0], item[1], item[2], item[3], item[4])

def renderTicks():
    stroke(0, 0, 0, 0.1)
    fill(0, 0, 0, 0.5)
    font("Helvetica", 12)
    align(CENTER)

    for x in range(1, int(RANGE+1), STEP):
        line(scale(x), 0, scale(x), FHEIGHT - 16)
        w = textwidth(str(x))
        text(str(x), scale(x) - w/2 + 1, FHEIGHT)

size(FWIDTH + BORDER_SIZE*2, FHEIGHT + BORDER_SIZE*2)
translate(-10, BORDER_SIZE)
RANGE = math.ceil(computeRange())
renderTicks()
renderIntervals()
