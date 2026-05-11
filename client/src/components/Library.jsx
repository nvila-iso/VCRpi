const Library = ({
  tapes,
  selectedTapeId,
  setSelectedTapeId,
  onNewTape,
  onEditTape,
}) => {
  return (
    <div className="flex flex-col gap-3 h-120 border-1 border-white/30">
      <div className="bg-black/30 flex items-center justify-between p-3 border-b border-white/30">
        <div>
          <p className="text-amber-400 font-black">TAPE LIBRARY</p>
          <p className="text-xs text-amber-400/60">テープライブラリ</p>
        </div>

        <button
          onClick={onNewTape}
          className="py-1 px-2 text-sm text-amber-400/60 border border-amber-400/60 cursor-pointer hover:text-amber-400 hover:border-amber-400 transition"
        >
          + NEW
        </button>
      </div>

      <div className="flex flex-col">
        {tapes.map((tape, index) => {
          const isSelected = tape.id === selectedTapeId;

          return (
            <button
              key={tape.id}
              onClick={() => setSelectedTapeId(tape.id)}
              className={`py-2 border-b border-white/40 text-left transition ${
                isSelected
                  ? "bg-amber-400/15 text-amber-200 border-l-4 border-l-amber-400"
                  : "hover:bg-white/10"
              }`}
            >
              <div className="w-[95%] mx-auto flex items-center justify-between">
                <p className="w-10 text-center border-1 border-white/30">
                  {String(index + 1).padStart(3, "0")}
                </p>
                <p>{tape.title}</p>
                <p className="text-sm">{tape.captureDate}</p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditTape(tape);
                  }}
                  className="w-12 text-center border border-amber-400/50 text-amber-400/70 hover:text-amber-300 hover:border-amber-300 transition"
                >
                  EDIT
                </button>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Library;
