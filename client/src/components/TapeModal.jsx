import { API_BASE } from "../config";
import vhs_tape from "../../public/vhs_tape.svg";
import { IoTriangle } from "react-icons/io5";
import { useState } from "react";

const TapeModal = ({ onSave, onCancel, tapeToEdit, onDelete, onTransfer }) => {
  const [coverPreview, setCoverPreview] = useState(
    tapeToEdit?.coverImage?.startsWith("/uploads")
      ? `${API_BASE}${tapeToEdit.coverImage}`
      : tapeToEdit?.coverImage || "/VAS_VHS.png",
  );

  const [title, setTitle] = useState(tapeToEdit?.title || "");
  const [length, setLength] = useState(tapeToEdit?.length || "");
  const [condition, setCondition] = useState(tapeToEdit?.condition || "");
  const [coverFile, setCoverFile] = useState(null);
  const [filePath, setFilePath] = useState(tapeToEdit?.coverImage || "--");
  const [fileLocation, setFileLocation] = useState(
    tapeToEdit?.recordings?.at(-1)?.status || "--",
  );

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSave({ title, length, condition, coverFile, coverPreview });
  };

  return (
    <>
      <div className="w-200 h-120 bg-[#1F0436] border-2 border-amber-200/50 p-3 rounded-xs flex flex-col justify-between">
        <div className="flex justify-between items-center">
          <p className="pl-5 text-blue-300 font-semibold">
            {tapeToEdit ? "EDIT TAPE" : "TAPE INSERTION"}
            <span className="text-xs text-amber-400/70"> テープ挿入</span>
          </p>
          <button
            onClick={() => onCancel()}
            className="text-xl text-amber-100 hover:text-amber-400 transition cursor-pointer"
          >
            X
          </button>
        </div>

        <div className="h-104 grid grid-cols-[1fr_1fr] border border-amber-200/50">
          <div className="p-3">
            {/* <img src="vad_logo 1.png" className="w-50 mx-auto"></img> */}
            <form
              onSubmit={handleSubmit}
              className="mt-5 text-amber-100 flex flex-col gap-5 items-center"
            >
              <label className="relative h-40 max-h-40 max-w-27 w-27 border border-amber-200/40 cursor-pointer group overflow-hidden">
                <img
                  src={coverPreview}
                  alt="VHS cover preview"
                  className="w-full h-full object-contain"
                />

                <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center">
                  <span className="text-amber-100 border border-amber-100 px-3 py-1 text-sm font-semibold">
                    BROWSE
                  </span>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  className="hidden"
                />
              </label>
              <input
                type="text"
                placeholder="TITLE"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="border-b border-amber-100 p-1 w-[90%]"
              />
              <input
                type="text"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="LENGTH"
                className="border-b border-amber-100 p-1 w-[90%]"
              />
              <select
                name=""
                id=""
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="p-1 border-b w-[90%] border-amber-100 text-amber-100"
              >
                <option value="" className="text-amber-100">
                  SELECT
                </option>
                <option value="excellent" className="">
                  EXCELLENT
                </option>
                <option value="good">GOOD</option>
                <option value="poor">POOR</option>
                <option value="bad">BAD</option>
              </select>
              <button
                type="submit"
                className="text-amber-100/50 font-semibold border border-amber-200/30 px-2 py-1 hover:border-amber-200/60 hover:text-amber-200/80 transition"
              >
                {tapeToEdit ? "SAVE" : "SUBMIT"}
              </button>
            </form>
            {tapeToEdit && (
              <div className="absolute top-15 flex w-90 justify-between">
                <button
                  onClick={onTransfer}
                  className="border border-amber-200/70 px-2 py-1 text-xs text-amber-200/70 hover:text-amber-200 hover:border-amber-200 transition cursor-pointer"
                >
                  TRANSFER
                </button>
                <button
                  onClick={onDelete}
                  className="border border-amber-200/70 px-2 py-1 text-xs text-amber-200/70 hover:text-amber-200 hover:border-amber-200 transition cursor-pointer"
                >
                  DELETE
                </button>
              </div>
            )}
          </div>
          <div className="border-l border-amber-200/30 relative">
            <img
              src="loading_tape.png"
              alt=""
              className="w-full h-full object-cover"
            />
            {tapeToEdit && (
              <div className="absolute top-5 left-2 px-2 py-1 w-45 rounded ">
                <div className="flex flex-col gap-3 text-xs">
                  <div className="">
                    <p className="text-amber-400">FILE</p>
                    <p className="">{filePath}</p>
                  </div>
                  <div>
                    <p className="text-amber-400">LOCATION</p>
                    <p className="">
                      {fileLocation === "ON_NAS" ? "NAS" : "Pi"}
                    </p>
                  </div>
                  <div>
                    <p className="text-amber-400">RECORDED AT</p>
                    <p className="">
                      {tapeToEdit?.recordings
                        ?.at(-1)
                        ?.recordedAt?.slice(0, 10) || "--"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TapeModal;
