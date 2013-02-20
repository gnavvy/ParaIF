from math import *
from PIL import Image, ImageDraw

__author__ = 'Yang'


class gosper:

    def index2coord(self, index, depth):
        sqrt3half = sqrt(3) / 2.0
        a = 1.0 / sqrt(7)   # length of flag triangle
        h = a * sqrt3half   # height of flag triangle
        d = sqrt(2.5 * 2.5 * a * a + h * h)

        seg = floor(index * 7)
        offset = 7 * index - seg
        if depth == 1:
            if seg == 0:
                x_out = a * offset
                y_out = 0
            elif seg == 1:
                x_out = a * (1 + 0.5 * offset)
                y_out = h * offset
            elif seg == 2:
                x_out = a * (1.5 - offset)
                y_out = h
            elif seg == 3:
                x_out = a * (0.5 - 0.5 * offset)
                y_out = h * (1 + offset)
            elif seg == 4:
                x_out = a * offset
                y_out = h * 2
            elif seg == 5:
                x_out = a * (1 + offset)
                y_out = h * 2
            else:
                x_out = a * (2 + 0.5 * offset)
                y_out = h * (2 - offset)
        else:
            if seg == 0:
                x, y = self.index2coord(offset, depth - 1)
                x_out = (x * 2.5 * a + y * h) / d * a
                y_out = (y * 2.5 * a - x * h) / d * a
            elif seg == 1:
                x, y = self.index2coord(1.0 - offset, depth - 1)
                xx = (x * 2.5 * a + y * h) / d * a
                yy = (y * 2.5 * a - x * h) / d * a
                x_out = -xx * 0.5 + yy * sqrt3half + 1.5 * a
                y_out = -yy * 0.5 - xx * sqrt3half + h
            elif seg == 2:
                x, y = self.index2coord(1.0 - offset, depth - 1)
                x_out = (x * 2.5 * a + y * h) / d * a + 0.5 * a
                y_out = (y * 2.5 * a - x * h) / d * a + h
            elif seg == 3:
                x, y = self.index2coord(offset, depth - 1)
                xx = (x * 2.5 * a + y * h) / d * a
                yy = (y * 2.5 * a - x * h) / d * a
                x_out = -xx * 0.5 - yy * sqrt3half + 0.5 * a
                y_out = -yy * 0.5 + xx * sqrt3half + h
            elif seg == 4:
                x, y = self.index2coord(offset, depth - 1)
                x_out = (x * 2.5 * a + y * h) / d * a
                y_out = (y * 2.5 * a - x * h) / d * a + 2 * h
            elif seg == 5:
                x, y = self.index2coord(offset, depth - 1)
                x_out = (x * 2.5 * a + y * h) / d * a + a
                y_out = (y * 2.5 * a - x * h) / d * a + 2 * h
            else:
                x, y = self.index2coord(1.0 - offset, depth - 1)
                xx = (x * 2.5 * a + y * h) / d * a
                yy = (y * 2.5 * a - x * h) / d * a
                x_out = -xx * 0.5 - yy * sqrt3half + 2.5 * a
                y_out = -yy * 0.5 + xx * sqrt3half + h

        return x_out, y_out


if __name__ == "__main__":
    g = gosper()
    img = Image.new('RGBA', (900, 900), (255, 255, 255))
    draw = ImageDraw.Draw(img)

    depth = 4
    test = [x * 0.00001 for x in range(100000)]

    x0 = 160
    y0 = 100
    for i in test:
        x, y = g.index2coord(i, depth)
        x *= 750
        y *= 750
        x += 160
        y += 100

        draw.line((x0, y0, x, y), (100, 100, 100))
        x0, y0 = x, y
    img.show()
