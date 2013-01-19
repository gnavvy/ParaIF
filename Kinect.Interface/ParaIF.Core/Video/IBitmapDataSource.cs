using ParaIF.Core.Struct;
using System.Drawing;

namespace ParaIF.Core.Video {
    public interface IBitmapDataSource : IDataSource<Bitmap> {
        IntSize Size { get; }
        int Width { get; }
        int Height { get; }
    }
}
