using ParaIF.Core.Struct;
using System.Collections.Generic;

namespace ParaIF.Core.Shape {
    public class ConvexHull {
        public ConvexHull(IList<Point> points) {
            this.Points = points;
        }

        public IList<Point> Points { get; protected set; }

        public int Count {
            get { return Points.Count; }
        }
    }
}
