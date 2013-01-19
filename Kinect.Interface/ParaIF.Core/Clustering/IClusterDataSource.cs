using ParaIF.Core.Struct;

namespace ParaIF.Core.Clustering {
    public interface IClusterDataSource : IDataSource<ClusterCollection> {
        IntSize Size { get; }
    }
}
