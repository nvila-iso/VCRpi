import { API_BASE } from "../config";

const TapeInfo = ({ tapes, selectedTapeId }) => {
  const selectedTape = tapes.find((tape) => tape.id === selectedTapeId);

  console.log("TapeInfo selectedTapeId:", selectedTapeId);
  console.log("TapeInfo tapes:", tapes);
  console.log("TapeInfo selectedTape:", selectedTape);
  return (
    <>
      <div className="border border-white/30 h-70">
        <div className="bg-black/30 border-b border-white/30 p-2">
          <p className="font-semibold text-amber-400">TAPE INFO </p>
          <p className="text-xs text-amber-400/60">テープ情報</p>
        </div>
        <div className="grid grid-cols-[1fr_1fr] p-2">
          <div className="text-sm flex flex-col gap-1">
            <div>
              <p class="text-xs text-amber-400">TITLE</p>
              <p>{selectedTape?.title || "NO TAPE SELECTED"}</p>
            </div>
            <div>
              <p class="text-xs text-amber-400">DATE</p>
              <p>{selectedTape?.captureDate || "--"}</p>
            </div>
            <div>
              <p class="text-xs text-amber-400">LENGTH</p>
              <p>{selectedTape?.length || "--"} MIN</p>
            </div>
            <div>
              <p class="text-xs text-amber-400">FORMAT</p>
              <p>{selectedTape?.format || "--"}</p>
            </div>
            <div>
              <p class="text-xs text-amber-400">CONDITION</p>
              <p>{selectedTape?.condition.toUpperCase() || "--"}</p>
            </div>
          </div>

          <div className="h-[80%] flex flex-col items-center justify-center">
            <img
              src={
                selectedTape?.coverImage?.startsWith("/uploads")
                  ? `${API_BASE}${selectedTape.coverImage}`
                  : selectedTape?.coverImage || "/VAS_VHS.png"
              }
              className="h-full object-cover"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default TapeInfo;
