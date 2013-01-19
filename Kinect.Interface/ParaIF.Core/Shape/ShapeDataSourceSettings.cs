
namespace ParaIF.Core.Shape {
    public class ShapeDataSourceSettings {
        public ShapeDataSourceSettings() {
            SetToDefault(this);
        }

        public float ContourLineThinningDistance { get; set; }
        public int MinimalPointsInContour { get; set; }

        public static void SetToDefault(ShapeDataSourceSettings settings) {
            settings.ContourLineThinningDistance = 5f;
            settings.MinimalPointsInContour = 50;
        }
    }
}
