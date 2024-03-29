﻿using Microsoft.Kinect;
using ParaIF.Core;
using ParaIF.Core.Clustering;
using ParaIF.Core.Shape;
using ParaIF.Core.Struct;
using ParaIF.Core.Video;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ParaIF.KinectSDK {
    public class SDKDataSourceFactory : IDataSourceFactory {
        private KinectSensor sensor;

        public SDKDataSourceFactory(bool useNearMode = true) {
            this.sensor = KinectSensor.KinectSensors.First();
            this.Adapter = new KinectSensorAdapter(this.sensor, useNearMode);
            this.sensor.Start();
            sensor.ColorStream.Enable(ColorImageFormat.RgbResolution640x480Fps30);
            sensor.DepthStream.Enable(DepthImageFormat.Resolution640x480Fps30);
        }

        private KinectSensorAdapter Adapter { get; set; }

        public IImageDataSource CreateRGBImageDataSource() {
            return new SDKRgbImageDataSource(this.Adapter);
        }

        public IImageDataSource CreateDepthImageDataSource() {
            return new SDKDepthImageDataSource(this.Adapter);
        }

        public IBitmapDataSource CreateRGBBitmapDataSource() {
            return new SDKRgbBitmapDataSource(this.Adapter);
        }

        public IBitmapDataSource CreateDepthBitmapDataSource() {
            return new SDKDepthBitmapDataSource(this.Adapter);
        }

        public IClusterDataSource CreateClusterDataSource(ClusterDataSourceSettings clusterDataSourceSettings) {
            var size = new IntSize(this.Adapter.DepthStreamWidth, this.Adapter.DepthStreamHeight);
            var clusterFactory = new KMeansClusterFactory(clusterDataSourceSettings, size);
            var filter = new ImageFrameDepthPointFilter(this.Adapter, size, clusterDataSourceSettings.MinimumDepthThreshold, clusterDataSourceSettings.MaximumDepthThreshold, clusterDataSourceSettings.LowerBorder);
            return new SDKClusterDataSource(this.Adapter, clusterFactory, filter);
        }

        public IClusterDataSource CreateClusterDataSource() {
            return this.CreateClusterDataSource(new ClusterDataSourceSettings());
        }

        public IShapeDataSource CreateShapeDataSource() {
            return new ClusterShapeDataSource(this.CreateClusterDataSource());
        }

        public IShapeDataSource CreateShapeDataSource(IClusterDataSource clusterdataSource) {
            return new ClusterShapeDataSource(clusterdataSource, new ShapeDataSourceSettings());
        }

        public IShapeDataSource CreateShapeDataSource(IClusterDataSource clusterdataSource, ShapeDataSourceSettings shapeDataSourceSettings) {
            return new ClusterShapeDataSource(clusterdataSource, shapeDataSourceSettings);
        }

        public IShapeDataSource CreateShapeDataSource(ClusterDataSourceSettings clusterDataSourceSettings, ShapeDataSourceSettings shapeDataSourceSettings) {
            return new ClusterShapeDataSource(this.CreateClusterDataSource(clusterDataSourceSettings), shapeDataSourceSettings);
        }

        public KinectSensor Sensor {
            get { return this.sensor; }
        }

        public void Dispose() {
            this.Adapter.Dispose();
            this.sensor.Dispose();
        }
    }
}
