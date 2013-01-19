using ParaIF.Core.Struct;
using System.Windows.Media;

namespace ParaIF.Core.Video {
    public interface IImageDataSource : IDataSource<ImageSource> {
        IntSize Size { get; }
        int Width { get; }
        int Height { get; }
    }
}
