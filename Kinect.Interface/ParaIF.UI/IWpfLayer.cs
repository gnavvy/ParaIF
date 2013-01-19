using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Controls;

namespace ParaIF.UI {
    public interface IWpfLayer : IDisposable {
        void Activate(Canvas canvas);
    }
}
