using System.Collections.Generic;

namespace ParaIF.Gesture {
    public class HandCollection {
        private IList<HandData> handData;

        public HandCollection() {
            this.handData = new List<HandData>();
        }

        public HandCollection(IList<HandData> data) {
            this.handData = data;
        }

        public IList<HandData> Hands {
            get { return this.handData; }
        }

        public int Count {
            get { return this.handData.Count; }
        }

        public bool HandsDetected {
            get { return this.Count > 0; }
        }

        public bool IsEmpty {
            get { return this.Count == 0; }
        }
    }
}
