using ParaIF.Core;
using ParaIF.Core.Struct;
using System.Collections.Generic;

namespace ParaIF.Gesture {
    public interface IHand : ILocatable {
        Point? PalmPoint { get; }
        bool HasPalmPoint { get; }
        float PalmX { get; }
        float PalmY { get; }
        IEnumerable<IFinger> Fingers { get; }
        int FingerCount { get; }
    }
}
