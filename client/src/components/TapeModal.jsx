import vhs_tape from "../../public/vhs_tape.svg";
import { IoTriangle } from "react-icons/io5";
import { useState } from "react";

const TapeModal = ({ onSave, onCancel, tapeToEdit }) => {
  const [coverPreview, setCoverPreview] = useState("/VAS_VHS.png");
  const [title, setTitle] = useState("");
  const [length, setLength] = useState("");
  const [condition, setCondition] = useState("");
  const [coverFile, setCoverFile] = useState(null);

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
            TAPE INSERTION{" "}
            <span className="text-xs text-amber-400/70">テープ挿入</span>
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
                SUBMIT
              </button>
            </form>
          </div>
          <div className="border-l border-amber-200/30 relative">
            <img
              src="loading_tape.png"
              alt=""
              className="w-full h-full object-cover"
            />

            <div className="absolute top-20 left-25 flex flex-col items-center gap-3">
              <IoTriangle className="text-3xl text-amber-100" />
              <img src={vhs_tape} alt="" className="w-full h-full" />
              <div className="text-center">
                <p className="text-xl text-amber-100 font-semibold">
                  INSERT CASSETTE
                </p>
                <p className="text-xs text-amber-100">
                  WAITING FOR SIGNAL . . .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TapeModal;
