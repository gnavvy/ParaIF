using ParaIF.Core.Video;
using System.Drawing;

namespace ParaIF.KinectSDK {
    public abstract class SDKBitmapDataSource : SensorDataSource<Bitmap>, IBitmapDataSource {
        public SDKBitmapDataSource(IKinectSensor nuiRuntime)
            : base(nuiRuntime) {
            this.CurrentValue = new Bitmap(this.Width, this.Height, System.Drawing.Imaging.PixelFormat.Format24bppRgb);
        }

        public override void Dispose() {
            this.CurrentValue.Dispose();
        }
    }
}
