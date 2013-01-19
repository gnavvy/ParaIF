using System;
using System.Drawing;

namespace ParaIF.UI {
    public interface ILayer : IDisposable {
        void Paint(Graphics g);
        event EventHandler RequestRefresh;
    }
}
