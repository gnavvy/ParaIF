using System.Collections.Generic;

namespace ParaIF.Core.Clustering {
    public interface IClusterMergeStrategy {
        IList<ClusterPrototype> MergeClustersIfRequired(IList<ClusterPrototype> clusters);
    }
}
