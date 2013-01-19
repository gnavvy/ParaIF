using ParaIF.Core.Clustering;
using ParaIF.Core.Shape;
using ParaIF.Core.Video;
using System;

namespace ParaIF.Core {
    public interface IDataSourceFactory : IDisposable {
        IBitmapDataSource CreateRGBBitmapDataSource();
        IBitmapDataSource CreateDepthBitmapDataSource();
        IImageDataSource CreateDepthImageDataSource();
        IImageDataSource CreateRGBImageDataSource();
        IClusterDataSource CreateClusterDataSource();
        IClusterDataSource CreateClusterDataSource(ClusterDataSourceSettings clusterDataSourceSettings);
        IShapeDataSource CreateShapeDataSource();
        IShapeDataSource CreateShapeDataSource(IClusterDataSource clusterdataSource);
        IShapeDataSource CreateShapeDataSource(IClusterDataSource clusterdataSource, ShapeDataSourceSettings shapeDataSourceSettings);
        IShapeDataSource CreateShapeDataSource(ClusterDataSourceSettings clusterDataSourceSettings, ShapeDataSourceSettings shapeDataSourceSettings);
    }
}
