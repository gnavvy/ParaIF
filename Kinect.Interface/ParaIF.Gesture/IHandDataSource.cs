using ParaIF.Core;
using ParaIF.Core.Struct;

namespace ParaIF.Gesture {
    public interface IHandDataSource : IDataSource<HandCollection> {
        int Width { get; }
        int Height { get; }
        IntSize Size { get; }
    }
}