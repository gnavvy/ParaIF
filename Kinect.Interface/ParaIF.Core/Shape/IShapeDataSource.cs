using ParaIF.Core.Struct;

namespace ParaIF.Core.Shape {
    public interface IShapeDataSource : IDataSource<ShapeCollection> {
        IntSize Size { get; }
        int Width { get; }
        int Height { get; }
    }
}
