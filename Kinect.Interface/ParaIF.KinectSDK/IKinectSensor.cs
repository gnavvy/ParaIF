using Microsoft.Kinect;
using System;

namespace ParaIF.KinectSDK {
    public interface IKinectSensor {
        int DepthStreamWidth { get; }
        int DepthStreamHeight { get; }
        int ColorStreamWidth { get; }
        int ColorStreamHeight { get; }

        event EventHandler<ColorImageFrameReadyEventArgs> ColorFrameReady;
        event EventHandler<DepthImageFrameReadyEventArgs> DepthFrameReady;
    }
}
