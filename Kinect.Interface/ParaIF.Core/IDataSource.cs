using System;

namespace ParaIF.Core {
    public delegate void NewDataHandler<TValue>(TValue data);
    public interface IDataSource : IDisposable {
        void Start();
        void Stop();
        bool IsRunning { get; }
    }

    public interface IDataSource<TValue> : IDataSource {
        TValue CurrentValue { get; }
        event NewDataHandler<TValue> NewDataAvailable;
    }
}
