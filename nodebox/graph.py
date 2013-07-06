# A quick hack to render graphs using NodeBox.
import math

FWIDTH = 1000
FHEIGHT = 160
HWIDTH = FWIDTH/2
HHEIGHT = FHEIGHT/2
BORDER_SIZE = 16
BOXHEIGHT = 24
LINEHEIGHT = 32

# [[name, mean, 5th %ile, 95th %ile, row-offset hack to make it look nice]]
DATA = [
  ["C", 2.48, 2.17, 2.80, 0],
  ["NaCl", 3.31, 2.94, 3.70, -1],
  ["Crossbridge", 5.98, 4.98, 6.98, 1],
  ["Java", 5.95, 5.00, 7.00, -2],
  ["asm.js", 6.72, 6.00, 8.00, 0],
  ["AS3", 10.4, 9.00, 12.0, 0],
  ["asm.js (Firefox)", 14.2, 13.0, 16.0, -1],
  ["Dart", 18.6, 17.0, 20.0, -1],
  ["Box2dWeb (Safari)", 20.0, 18.0, 23.0, 1],
  ["asm.js (Chrome)", 23.0, 17.0, 29.0, -2],
  ["Box2Web (Chrome)", 26.9, 23.0, 42.0, -1],
  ["Box2dWeb (Firefox)", 29.5, 27.0, 32.0, 0],
  ["asm.js (IE10)", 33.7, 26.6, 42.0, 1],
  ["Box2dWeb (IE10)", 37.9, 35.0, 48.3, 0]
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
