__author__ = 'Yang'

from math import sqrt, floor
from PIL import Image, ImageDraw


class Gosper:
    def index2coord19(self, index, depth):
        direction = [0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1]
        sqrt3half = sqrt(3) / 2.0
        a = 1.0 / sqrt(19)  # length of flag triangle
        h = a * sqrt3half   # height of flag triangle
        seg = int(floor(index * 19))
        off = index * 19 - seg
        if depth == 1:
            if seg == 0:
                x, y = a * off, 0
            elif seg == 1:
                x, y = a * (1 + off), 0
            elif seg == 2:
                x, y = a * (2 + 0.5 * off), h * off
            elif seg == 3:
                x, y = a * (2.5 + 0.5 * off), h * (1 + off)
            elif seg == 4:
                x, y = a * (3 - 0.5 * off), h * (2 + off)
            elif seg == 5:
                x, y = a * (2.5 - off), h * 3
            elif seg == 6:
                x, y = a * (1.5 - off), h * 3
            elif seg == 7:
                x, y = a * (0.5 + 0.5 * off), h * (3 - off)
            elif seg == 8:
                x, y = a * (1 + off), h * 2
            elif seg == 9:
                x, y = a * (2 - 0.5 * off), h * (2 - off)
            elif seg == 10:
                x, y = a * (1.5 - off), h
            elif seg == 11:
                x, y = a * (0.5 - 0.5 * off), h * (1 + off)
            elif seg == 12:
                x, y = a * (-0.5 * off), h * (2 + off)
            elif seg == 13:
                x, y = a * (-0.5 + 0.5 * off), h * (3 + off)
            elif seg == 14:
                x, y = a * off, h * 4
            elif seg == 15:
                x, y = a * (1 + off), h * 4
            elif seg == 16:
                x, y = a * (2 + off), h * 4
            elif seg == 17:
                x, y = a * (3 + 0.5 * off), h * (4 - off)
            else:
                x, y = a * (3.5 + 0.5 * off), h * (3 - off)
        else:
            _off = off if direction[seg] == 0 else 1.0 - off
            _x, _y = self.index2coord19(_off, depth - 1)
            xx, yy = (_x * a * 4 + _y * h * 2) * a, (_y * a * 4 - _x * h * 2) * a
            if seg == 0:
                x, y = xx, yy
            elif seg == 1:
                x, y = xx + a, yy
            elif seg == 2:
                x, y = -xx * 0.5 + yy * sqrt3half + a * 2.5, -yy * 0.5 - xx * sqrt3half + h
            elif seg == 3:
                x, y = -xx * 0.5 + yy * sqrt3half + a * 3.0, -yy * 0.5 - xx * sqrt3half + h * 2
            elif seg == 4:
                x, y = -xx * 0.5 - yy * sqrt3half + a * 3.0, -yy * 0.5 + xx * sqrt3half + h * 2
            elif seg == 5:
                x, y = xx + a * 1.5, yy + h * 3
            elif seg == 6:
                x, y = xx + a * 0.5, yy + h * 3
            elif seg == 7:
                x, y = -xx * 0.5 - yy * sqrt3half + a * 1.0, -yy * 0.5 + xx * sqrt3half + h * 2
            elif seg == 8:
                x, y = xx + a, yy + h * 2
            elif seg == 9:
                x, y = -xx * 0.5 + yy * sqrt3half + a * 2.0, -yy * 0.5 - xx * sqrt3half + h * 2
            elif seg == 10:
                x, y = xx + a * 0.5, yy + h
            elif seg == 11:
                x, y = -xx * 0.5 - yy * sqrt3half + a * 0.5, -yy * 0.5 + xx * sqrt3half + h
            elif seg == 12:
                x, y = -xx * 0.5 - yy * sqrt3half, -yy * 0.5 + xx * sqrt3half + h * 2
            elif seg == 13:
                x, y = -xx * 0.5 + yy * sqrt3half, -yy * 0.5 - xx * sqrt3half + h * 4
            elif seg == 14:
                x, y = xx, yy + h * 4
            elif seg == 15:
                x, y = xx + a, yy + h * 4
            elif seg == 16:
                x, y = xx + a * 2.0, yy + h * 4
            elif seg == 17:
                x, y = -xx * 0.5 - yy * sqrt3half + a * 3.5, -yy * 0.5 + xx * sqrt3half + h * 3
            else:
                x, y = -xx * 0.5 - yy * sqrt3half + a * 4.0, -yy * 0.5 + xx * sqrt3half + h * 2
        return x, y

    def index2coord7(self, index, depth):
        direction = [0, 1, 1, 0, 0, 0, 1]
        sqrt3half = sqrt(3) / 2.0
        a = 1.0 / sqrt(7)   # length of flag triangle
        h = a * sqrt3half   # height of flag triangle
        seg = int(floor(index * 7))
        offset = index * 7 - seg
        if depth == 1:
            if seg == 0:
                x, y = a * offset, 0
            elif seg == 1:
                x, y = a * (1 + 0.5 * offset), h * offset
            elif seg == 2:
                x, y = a * (1.5 - offset), h
            elif seg == 3:
                x, y = a * (0.5 - 0.5 * offset), h * (1 + offset)
            elif seg == 4:
                x, y = a * offset, h * 2
            elif seg == 5:
                x, y = a * (1 + offset), h * 2
            else:
                x, y = a * (2 + 0.5 * offset), h * (2 - offset)
        else:
            _offset = offset if direction[seg] == 0 else 1.0 - offset
            _x, _y = self.index2coord7(_offset, depth - 1)
            xx, yy = (_x * a * 2.5 + _y * h) * a, (_y * a * 2.5 - _x * h) * a
            if seg == 0:
                x, y = xx, yy
            elif seg == 1:
                x, y = -xx * 0.5 + yy * sqrt3half + 1.5 * a, -yy * 0.5 - xx * sqrt3half + h
            elif seg == 2:
                x, y = xx + 0.5 * a, yy + h
            elif seg == 3:
                x, y = -xx * 0.5 - yy * sqrt3half + 0.5 * a, -yy * 0.5 + xx * sqrt3half + h
            elif seg == 4:
                x, y = xx, yy + 2 * h
            elif seg == 5:
                x, y = xx + a, yy + 2 * h
            else:
                x, y = -xx * 0.5 - yy * sqrt3half + 2.5 * a, -yy * 0.5 + xx * sqrt3half + h
        return x, y


if __name__ == "__main__":
    g = Gosper()
    img = Image.new('RGBA', (900, 900), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    depth = 4
    test = [x * 0.00001 for x in range(100000)]

    x0 = 200
    y0 = 100
    for i in test:
        # x, y = g.index2coord7(i, depth)
        x, y = g.index2coord19(i, depth)
        x *= 750
        y *= 750
        x += 200
        y += 100

        draw.line((x0, y0, x, y), (100, 100, 100))
        x0, y0 = x, y
    img2 = img.transpose(Image.FLIP_TOP_BOTTOM)
    img2.show()
