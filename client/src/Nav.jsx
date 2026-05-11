const Nav = ({ isRecording }) => {
  return (
    <div className="py-2 px-5 border-1 bg-black/30 flex justify-between items-center">
      <div>
        <p className="text-xs text-amber-500/60">親切に、巻き戻しを。</p>
        <p className="text-3xl text-amber-500 font-black">
          VIDEO ARCHIVE SYSTEM
        </p>
        <p className="text-sm text-amber-500/60">RPI CAPTURE STATION v1.0</p>
      </div>

      <div className="flex gap-5">
        <div className="w-35 text-sm border-1 border-white/30 text-white p-3">
          <p className="font-bold opacity-80">SYSTEM TIME</p>
          <p>21:48:36</p>
          <p>05/24/1994</p>
        </div>
        <div className="w-35 text-sm border-1 border-white/30 text-white p-3">
          <p className="font-bold opacity-80">STATUS</p>
          <p
            className={`text-xl font-bold ${
              isRecording ? "text-red-400" : "text-emerald-300"
            }`}
          >
            {isRecording ? "RECORDING" : "STANDBY"}
          </p>
        </div>
        <div className="w-45 ">
          <img src="vad_logo 1.png" className="h-full w-full object-contain" />
        </div>
      </div>
    </div>
  );
};
export default Nav;
