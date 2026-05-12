import { API_BASE } from "../config";

import { IoIosRewind } from "react-icons/io";
import { IoIosPlay } from "react-icons/io";
import { IoIosPause } from "react-icons/io";
import { IoStopSharp } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import { FaCamera } from "react-icons/fa6";
import { FaEject } from "react-icons/fa";

const TransportControls = ({
  isRecording,
  setIsRecording,
  tapes,
  selectedTapeId,
  setTapes,
  setSystemStatus,
  updateTape,
}) => {
  const selectedTape = tapes.find((tape) => tape.id === selectedTapeId);

  const makeFilename = (title) => {
    return `${title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")}_${new Date().toISOString().slice(0, 10)}.mkv`;
  };

  const handleRecord = async () => {
    try {
      if (!selectedTape && !isRecording) {
        alert("No tape selected.");
        return;
      }

      if (isRecording) {
        const confirmed = window.confirm(
          "Are you sure you want to stop recording?",
        );

        if (!confirmed) return;

        try {
          const response = await fetch(`${API_BASE}/api/record/stop`, {
            method: "POST",
          });

          let data = {};

          try {
            data = await response.json();
          } catch {
            console.log("Stop endpoint returned no JSON");
          }

          console.log(data);

          if (!response.ok) {
            if (data.error === "No recording in progress") {
              setIsRecording(false);
              setSystemStatus("STANDBY");

              await updateTape(selectedTapeId, {
                status: "READY",
              });

              return;
            }

            setSystemStatus("ERROR");
            console.error(data.error);
            return;
          }

          const stoppedAt = new Date().toISOString();

          await updateTape(selectedTapeId, {
            status: "RECORDED",
            recordingStoppedAt: stoppedAt,
            recordings: [
              ...(selectedTape.recordings || []),
              {
                filename: selectedTape.activeRecordingFilename,
                recordedAt: selectedTape.recordingStartedAt,
                stoppedAt,
                status: "ON_PI",
              },
            ],
            activeRecordingFilename: null,
          });

          setIsRecording(false);
          setSystemStatus("STANDBY");
        } catch (err) {
          setSystemStatus("ERROR");
          console.error("Stop request failed:", err);
        }

        return;
      }

      const response = await fetch(`${API_BASE}/api/record/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: selectedTape.title,
          minutes: 120,
          countdown: 5,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSystemStatus("ERROR");
        console.error(data.error);
        return;
      }

      console.log(data);

      const filename = makeFilename(selectedTape.title);
      const startedAt = new Date().toISOString();

      await updateTape(selectedTapeId, {
        status: "CAPTURING",
        recordingStartedAt: startedAt,
        activeRecordingFilename: filename,
      });

      setIsRecording(true);
      setSystemStatus("RECORDING");
    } catch (err) {
      setSystemStatus("ERROR");
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
