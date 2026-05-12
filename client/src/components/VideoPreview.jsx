import { IoTriangle } from "react-icons/io5";
import vhs_tape from "../../public/vhs_tape.svg";

const VideoPreview = () => {
  return (
    <>
      <div className="border border-white/30 p-3">
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-amber-400">
            LIVE PREVIEW{" "}
            <span className="text-xs text-amber-400/60">ライブプレビュー</span>
          </p>
          <div className="relative bg-black/50 flex justify-center items-center h-90">
            <div className="z-1 top-20 left-25 flex flex-col items-center gap-3">
              <IoTriangle className="text-3xl text-amber-100" />
              <img src={vhs_tape} alt="" className="w-full h-full" />
              <div className="text-center">
                <p className="text-xl text-amber-100 font-semibold">
                  INSERT CASSETTE
                </p>
                <p className="font-semibold text-xs text-amber-100 flex justify-center">
                  WAITING FOR SIGNAL
                  <span className="ml-1 flex gap-2 ">
                    <span className="dot-1">.</span>
                    <span className="dot-2">.</span>
                    <span className="dot-3">.</span>
                  </span>
                </p>
              </div>
            </div>
            {/* <img
              src="no_signal.png"
              className="absolute h-full w-full object-fit"
            ></img> */}
          </div>
        </div>
      </div>
    </>
  );
};
export default VideoPreview;
