using ParaIF.Core;
using ParaIF.Core.Struct;

namespace ParaIF.Gesture {
    public interface IFinger : ILocatable {
        Point Fingertip { get; }
    }
}
