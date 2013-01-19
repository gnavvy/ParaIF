using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParaIF.Core.Shape {
    public class ShapeCollection {
        public ShapeCollection() {
            this.Shapes = new List<Shape>();
        }

        public ShapeCollection(IList<Shape> shapes) {
            this.Shapes = shapes;
        }

        public IList<Shape> Shapes { get; private set; }

        public int Count {
            get { return this.Shapes.Count; }
        }
    }
}
