using ParaIF.Core.Video;
using System.Windows.Media;
using System.Windows.Media.Imaging;

namespace ParaIF.KinectSDK {
    public abstract class SDKImageDataSource : SensorDataSource<ImageSource>, IImageDataSource {
        protected WriteableBitmap writeableBitmap;

        public SDKImageDataSource(IKinectSensor nuiRuntime)
            : base(nuiRuntime) {
            this.writeableBitmap = new WriteableBitmap(this.Width, this.Height, 96, 96, PixelFormats.Bgr32, null);
            this.CurrentValue = this.writeableBitmap;
        }
    }
}
