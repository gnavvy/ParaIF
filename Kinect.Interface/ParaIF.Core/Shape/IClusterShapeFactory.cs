using ParaIF.Core.Clustering;

namespace ParaIF.Core.Shape {
    public interface IClusterShapeFactory {
        ShapeCollection Create(ClusterCollection clusterData);
    }
}
