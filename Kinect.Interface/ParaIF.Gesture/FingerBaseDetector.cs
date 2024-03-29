﻿using ParaIF.Core.Shape;
using ParaIF.Core.Struct;
using System.Collections.Generic;

namespace ParaIF.Gesture {
    internal class FingerBaseDetector {
        private float indexOffset;
        private float offsetDistance;

        public FingerBaseDetector(HandDataSourceSettings settings) {
            this.indexOffset = settings.FingerBaseIndexOffset;
            this.offsetDistance = settings.FingerBaseOffsetDistance;
        }

        public void Detect(Contour contour, IList<FingerPoint> fingerTips) {
            foreach (var fingerPoint in fingerTips) {
                FindBasePoints(contour, fingerPoint);
            }
        }

        private void FindBasePoints(Contour contour, FingerPoint fingerPoint) {
            var fingerPointIndex = FindIndex(fingerPoint.Fingertip, contour);
            var distanceAdjustedOffset = (int)(offsetDistance * indexOffset / fingerPoint.Fingertip.Z);

            fingerPoint.BaseLeft = contour.GetPointAt(Rollover(fingerPointIndex - distanceAdjustedOffset, contour.Count));
            fingerPoint.BaseRight = contour.GetPointAt(Rollover(fingerPointIndex + distanceAdjustedOffset, contour.Count));

            var baseCenter = Point.Center(fingerPoint.BaseLeft, fingerPoint.BaseRight);
            fingerPoint.DirectionVector = Point.Subtract(fingerPoint.Fingertip, baseCenter).GetNormalizedVector();
        }

        private int Rollover(int index, int maxIndex) {
            if (index < 0) {
                return index + maxIndex;
            }
            if (index >= maxIndex) {
                return index - maxIndex;
            }
            return index;
        }

        private int FindIndex(Point point, Contour contour) {
            return Point.FindIndexOfNearestPoint(point, contour.Points);
        }
    }
}
