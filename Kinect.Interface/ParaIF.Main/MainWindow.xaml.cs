using ParaIF.Core;
using ParaIF.Core.Clustering;
using ParaIF.Core.Shape;
using ParaIF.Core.Video;
using ParaIF.Gesture;
using ParaIF.KinectSDK;
using ParaIF.UI;
using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Media;

namespace ParaIF {
    public partial class MainWindow : Window {
        private IDataSourceFactory _factory;
        private IHandDataSource _handDataSource;
        private IClusterDataSource _clusterDataSource;
        private IImageDataSource _depthImageSource;

        public MainWindow() {
            InitializeComponent();
            Start();
        }

        private void Start() {
            _checkClusterLayer.IsEnabled = true;
            _checkClusterLayer.IsChecked = true;
            _checkHandLayer.IsEnabled = true;
            _checkHandLayer.IsChecked = true;

            _factory = new SDKDataSourceFactory();

            _depthImageSource = _factory.CreateDepthImageDataSource();
            _depthImageSource.NewDataAvailable += new NewDataHandler<ImageSource>(MainWindow_NewDataAvailable);
            _depthImageSource.Start();

            _clusterDataSource = _factory.CreateClusterDataSource(new ClusterDataSourceSettings { MaximumDepthThreshold = 900 });
            _clusterDataSource.NewDataAvailable += new NewDataHandler<ClusterCollection>(ClusterDataSource_NewDataAvailable);
            _clusterDataSource.Start();

            _handDataSource = new HandDataSource(_factory.CreateShapeDataSource(_clusterDataSource, new ShapeDataSourceSettings()));
            _handDataSource.NewDataAvailable += new NewDataHandler<HandCollection>(HandDataSource_NewDataAvailable);
            _handDataSource.Start();

            UpdateLayers();
        }

        private void HandDataSource_NewDataAvailable(HandCollection data) {
            // todo udp
        }

        private void ClusterDataSource_NewDataAvailable(ClusterCollection data) {
            // todo
        }

        private void MainWindow_NewDataAvailable(ImageSource data) {
            _videoControl.Dispatcher.Invoke(new Action(() => { _videoControl.ShowImageSource(data); }));
        }

        private void Window_Closing(object sender, System.ComponentModel.CancelEventArgs e) {
            new Action(() => {
                _handDataSource.Stop();
                _factory.Dispose();
            }).BeginInvoke(null, null);
        }

        private void checkHandLayer_Click(object sender, RoutedEventArgs e) {
            UpdateLayers();
        }

        private void checkClusterLayer_Click(object sender, RoutedEventArgs e) {
            UpdateLayers();
        }

        private void UpdateLayers() {
            var layers = new List<IWpfLayer>();
            if (_checkHandLayer.IsChecked.GetValueOrDefault()) {
                layers.Add(new WpfHandLayer(_handDataSource));
            }
            if (_checkClusterLayer.IsChecked.GetValueOrDefault()) {
                layers.Add(new WpfClusterLayer(_clusterDataSource));
            }
            _videoControl.Layers = layers;
        }

        private void Start_Button_Click(object sender, RoutedEventArgs e) {
            Start();
        }

        private void Exit_Button_Click(object sender, RoutedEventArgs e) {
            Close();
        }
    }
}
