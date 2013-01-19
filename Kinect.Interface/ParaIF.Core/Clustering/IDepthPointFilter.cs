using ParaIF.Core.Struct;
using System.Collections.Generic;

namespace ParaIF.Core.Clustering {
    public interface IDepthPointFilter<TSource> {
        IList<Point> Filter(TSource source);
    }
}
