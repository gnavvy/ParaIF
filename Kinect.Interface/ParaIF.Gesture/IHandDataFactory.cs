using ParaIF.Core.Shape;

namespace ParaIF.Gesture {
    public interface IHandDataFactory {
        HandCollection Create(ShapeCollection shapes);
    }
}