const SignalStatus = () => {
  return (
    <>
      <div className="border border-white/30">
        <div className="border-b border-white/30 bg-black/30 p-2">
          <p className="font-semibold text-amber-400">SIGNAL STATUS</p>
          <p className="text-xs text-amber-400/70">信号状態</p>
        </div>
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-5 text-xs p-1">
          <div className="text-blue-300 font-semibold">
            <p>VIDEO SIGNAL</p>
            <p>SYNC</p>
            <p>COLOR</p>
            <p>TRACKING</p>
          </div>
          <div>
            <p>GOOD</p>
            <p className="text-emerald-300">LOCKED</p>
            <p>STABLE</p>
            <p>AUTO</p>
          </div>
          <div>
            <div className="border border-white/30 h-full"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignalStatus;
