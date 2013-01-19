using ParaIF.Core.Struct;
using System.Collections.Generic;

namespace ParaIF.Core.Shape {
    public class Contour {
        private IList<Point> points;

        public Contour()
            : this(new List<Point>()) { }

        public Contour(IList<Point> points) {
            this.points = points;
        }

        public IList<Point> Points {
            get { return this.points; }
        }

        public int Count {
            get { return this.points.Count; }
        }

        public Point GetPointAt(int index) {
            return this.points[index];
        }

        public static Contour Empty {
            get { return new Contour(); }
        }
    }
}
