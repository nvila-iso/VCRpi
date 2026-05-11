const AudioLevels = () => {
  return (
    <>
      <div className="flex flex-col border border-white/30">
        <div className="bg-black/30 text-sm border-b border-white/30 p-2">
          <p className="font-semibold text-amber-400">AUDIO LEVEL</p>
          <p className="text-xs text-amber-400/70">オーディオレベル</p>
        </div>
        <div className="flex justify-between items-center px-2">
          <p className="text-2xl font-semibold">L</p>
          <div className="h-4 w-[90%] bg-gradient-to-r from-green-500 via-red-500 to-yellow-500"></div>
        </div>
        <div className="flex justify-between items-center px-2">
          <p className="text-2xl font-semibold">R</p>
          <div className="h-4 w-[90%] bg-gradient-to-r from-green-500 via-red-500 to-yellow-500"></div>
        </div>
        <div className="text-xs flex justify-between items-center px-8 py-1">
            <p>-15</p>
            <p>-10</p>
            <p>-5</p>
            <p>0</p>
            <p>5</p>
            <p>10</p>
            <p>15</p>
        </div>
      </div>
    </>
  );
};

export default AudioLevels;
