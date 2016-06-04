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
  ["C" , 2.05 , 1.80, 2.30, 6],
  ["pNaCl", 2.32, 1.99, 2.70, 5],
  ["asm.js (Firefox)", 2.63, 2.00, 3.00, 4],
  ["Java", 3.31, 3.00, 4.00, 3],
  ["asm.js (Chrome)", 3.47, 3.00, 4.00, 2],
  ["asm.js (Safari)", 3.94, 3.00, 5.00, 1],
  ["asm.js (Edge)", 4.18, 3, 5, 0],
  ["Dart VM", 5.04, 4.00, 7.00, -1],
  ["Box2dWeb (Chrome)", 5.68, 5.00, 7.00, -2],
  ["Box2dWeb (Firefox)", 6.75, 6.00, 8.00, -3],
  ["Box2dWeb (Edge)", 7.72, 6, 9, -4],
  ["Box2dWeb (Safari)", 8.20, 7.00, 10.0, -5],
  ["AS3", 9.95, 9.00, 12.0, -6],
  ["Dart2js (Chrome)", 11.1, 10.0, 14.0, -7]
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
