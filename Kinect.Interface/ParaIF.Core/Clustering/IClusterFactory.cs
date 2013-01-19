using ParaIF.Core.Struct;
using System.Collections.Generic;

namespace ParaIF.Core.Clustering {
    public interface IClusterFactory {
        ClusterCollection Create(IList<Point> points);
    }
}
