using ParaIF.Core;
using ParaIF.Core.Shape;
using ParaIF.Core.Struct;

namespace ParaIF.Gesture {
    public class HandDataSource : DataSourceProcessor<HandCollection, ShapeCollection>, IHandDataSource {
        private IntSize size;
        private ShapeHandDataFactory factory;

        public HandDataSource(IShapeDataSource shapeDataSource)
            : this(shapeDataSource, new HandDataSourceSettings()) { }

        public HandDataSource(IShapeDataSource shapeDataSource, HandDataSourceSettings settings)
            : base(shapeDataSource) {
            this.factory = new ShapeHandDataFactory(settings);
            this.size = shapeDataSource.Size;
            this.CurrentValue = new HandCollection();
        }

        public int Width {
            get { return this.size.Width; }
        }

        public int Height {
            get { return this.size.Height; }
        }

        public IntSize Size {
            get { return this.size; }
        }

        protected override unsafe HandCollection Process(ShapeCollection shapeData) {
            return this.factory.Create(shapeData);
        }
    }
}
