import { IoIosRewind } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import { FaEject } from "react-icons/fa";

const TransportControls = ({ isRecording, setIsRecording }) => {
  const handleRecord = async () => {
    try {
      if (isRecording) {
        const confirmed = window.confirm(
          "Are you sure you want to cancel recording?",
        );

        if (!confirmed) return;

        try {
          const response = await fetch(
            "http://localhost:5174/api/record/stop",
            {
              method: "POST",
            },
          );

          const data = await response.json();
          console.log(data);
        } catch (err) {
          console.error("Stop request failed:", err);
        }

        setIsRecording(false);
        return;
      }

      const response = await fetch("http://localhost:5174/api/record/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "TEST_WEB",
          minutes: 1,
          countdown: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data.error);
        return;
      }

      console.log(data);
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  return (
    <>
      <div className="border border-white/30">
        <div className="bg-black/30 border-b border-white/30">
          <p className="font-semibold text-amber-400 p-2">
            TRANSPORT CONTROLS{" "}
            <span className="text-xs text-amber-400/70">
              トランスポートコントロール
            </span>
          </p>
        </div>
        <div className="flex gap-2 p-2 justify-center">
          <div className="flex flex-col justify-center items-center gap-2 w-40 h-20 border border-white/30 bg-white/10 hover:bg-white/5 hover:inset-shadow-2xs hover:inset-shadow-black/80 group transition">
            <p className="text-sm group-hover:text-white/60 transition">REW</p>
            <IoIosRewind className="text-3xl group-hover:text-white/60 transition" />
          </div>

          <div className="flex flex-col justify-center items-center gap-2 w-40 h-20 border border-white/30 bg-white/10 hover:bg-white/5 hover:inset-shadow-2xs hover:inset-shadow-black/80 group transition">
            <p className="text-sm group-hover:text-white/60 transition">PLAY</p>
            <IoIosPlay className="text-3xl group-hover:text-white/60 transition" />
          </div>

          <div className="flex flex-col justify-center items-center gap-2 w-40 h-20 border border-white/30 bg-white/10 hover:bg-white/5 hover:inset-shadow-2xs hover:inset-shadow-black/80 group transition">
            <p className="text-sm group-hover:text-white/60 transition">
              PAUSE
            </p>
            <IoIosPause className="text-3xl group-hover:text-white/60 transition" />
          </div>

          <div className="flex flex-col justify-center items-center gap-2 w-40 h-20 border border-white/30 bg-white/10 hover:bg-white/5 hover:inset-shadow-2xs hover:inset-shadow-black/80 group transition">
            <p className="text-sm group-hover:text-white/60 transition">STOP</p>
            <IoStopSharp className="text-3xl group-hover:text-white/60 transition" />
          </div>

          <button
            onClick={handleRecord}
            className={`flex flex-col justify-center items-center gap-2 w-40 h-20 border transition
            ${
              isRecording
                ? "border-red-500 bg-red-500/20 text-red-400"
                : "border-white/30 bg-white/10 hover:bg-red-500/10 hover:border-red-500/10"
            }
            hover:inset-shadow-2xs hover:inset-shadow-black/80 group`}
          >
            <div className="flex gap-1 items-center relative top-1 group-hover:text-red-500/50">
              <FaCircle className="text-2xl" />
              <p className="text-xl">REC</p>
            </div>

            <div
              className={`w-15 h-1 relative top-4.5 group-hover:bg-red-500/50 transition ${isRecording ? "bg-red-500/80" : "bg-white"}`}
            ></div>
          </button>

          <div className="flex flex-col justify-center items-center gap-2 w-40 h-20 border border-white/30 bg-white/10 hover:bg-white/5 hover:inset-shadow-2xs hover:inset-shadow-black/80 group transition">
            <p className="text-sm group-hover:text-white/60 transition">
              CAPTURE
            </p>
            <FaCamera className="text-3xl group-hover:text-white/60 transition" />
          </div>

          <div className="flex flex-col justify-center items-center gap-2 w-40 h-20 border border-white/30 bg-white/10 hover:bg-white/5 hover:inset-shadow-2xs hover:inset-shadow-black/80 group transition">
            <p className="text-sm group-hover:text-white/60 transition">
              EJECT
            </p>
            <FaEject className="text-3xl group-hover:text-white/60 transition" />
          </div>
        </div>
      </div>
    </>
  );
};
export default TransportControls;
