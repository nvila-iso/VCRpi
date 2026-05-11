const SystemInfo = () => {
  return (
    <>
      <div className="border border-white/30 flex flex-col">
        <div className="border-b border-white/30 py-1 bg-black/30 px-2">
          <p className="text-amber-400 font-bold">SYSTEM INFO</p>
          <p className="text-amber-400/70 text-xs">システム情報</p>
        </div>
        <div className="grid grid-cols-[1fr_1fr] text-sm p-2">
          <div className="font-semibold text-blue-300 flex flex-col gap-1">
            <p className="border-b border-white/10">INPUT</p>
            <p className="border-b border-white/10">RESOLUTION</p>
            <p className="border-b border-white/10">AUDIO</p>
            <p className="border-b border-white/10">DROP FRAMES</p>
            <p className="border-b border-white/10">DISK SPACE</p>
            <p className="border-b border-white/10">CPU LOAD</p>
            <p className="border-b border-white/10">TEMPERATURE</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="border-b border-white/10">COMPOSITE</p>
            <p className="border-b border-white/10">720x480 (NTSC)</p>
            <p className="border-b border-white/10">PCM 48kHz</p>
            <p className="border-b border-white/10">0</p>
            <p className="border-b border-white/10">1.2 TB FREE</p>
            <p className="border-b border-white/10">10%</p>
            <p className="border-b border-white/10">70C</p>
          </div>
        </div>
      </div>
    </>
  );
};
export default SystemInfo;
