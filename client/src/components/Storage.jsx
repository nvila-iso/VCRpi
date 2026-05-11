const Storage = () => {
  return (
    <>
      <div className="border border-white/30 px-2 h-13 flex flex-col justify-center bg-black/30">
        <p className="text-amber-400 font-bold">STORAGE</p>
        <div className="text-amber-400/70 flex justify-between items-center text-xs">
          <p className="">ストレージ</p>
          <div className="w-25 h-3 border border-white flex items-center">
            <div className="w-[60%] h-2 bg-yellow-400 "></div>
          </div>
          <p>1.2 TB / 3.5 TB</p>
        </div>
      </div>
    </>
  );
};
export default Storage;
