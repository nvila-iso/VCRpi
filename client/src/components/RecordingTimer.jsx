import { useEffect, useState } from "react";

const RecordingTimer = ({ isRecording, startedAt }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isRecording || !startedAt) {
      setElapsedSeconds(0);
      return;
    }

    const updateTimer = () => {
      const startTime = new Date(startedAt).getTime();
      const now = Date.now();
      const seconds = Math.floor((now - startTime) / 1000);

      setElapsedSeconds(seconds);
    };

    updateTimer();

    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [isRecording, startedAt]);

  const hours = String(Math.floor(elapsedSeconds / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((elapsedSeconds % 3600) / 60)).padStart(
    2,
    "0",
  );
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");

  return (
    <div className="border border-white/30 bg-black/30 p-3 text-amber-400">
      <p className="text-xs text-amber-400/60">RECORDING TIMER</p>

      <p
        className={`text-3xl font-mono font-bold ${
          isRecording ? "text-red-400" : "text-amber-400/40"
        }`}
      >
        {hours}:{minutes}:{seconds}
      </p>

      <p className="text-xs text-amber-400/50">
        {isRecording ? "CAPTURE IN PROGRESS" : "NO ACTIVE CAPTURE"}
      </p>
    </div>
  );
};

export default RecordingTimer;
