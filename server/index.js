const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
const PORT = 5174;

app.use(cors());
app.use(express.json());

let recordingProcess = null;

app.post("/api/record/start", (req, res) => {
  if (recordingProcess) {
    return res.status(400).json({ error: "Recording already in progress" });
  }

  const { name, minutes = 120, countdown = 10 } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tape name is required" });
  }

  const scriptPath = path.join(__dirname, "../scripts/record.sh");

  recordingProcess = spawn(scriptPath, [name, minutes, countdown], {
    cwd: path.join(__dirname, "../scripts"),
  });

  recordingProcess.on("error", (err) => {
    console.error("Failed to start record.sh", err.message);
    recordingProcess = null;
  });

  recordingProcess.stdout.on("data", (data) => {
    console.log(`[record] ${data}`);
  });

  recordingProcess.stderr.on("data", (data) => {
    console.error(`[record] ${data}`);
  });

  recordingProcess.on("close", (code) => {
    console.log(`record.sh exited with code ${code}`);
    recordingProcess = null;
  });

  res.json({
    ok: true,
    message: "Recording started",
    name,
    minutes,
    countdown,
  });
});

app.post("/api/record/stop", (req, res) => {
  if (!recordingProcess) {
    return res.status(400).json({ error: "No recording in progress" });
  }

  recordingProcess.kill("SIGINT");

  res.json({ ok: true, message: "Stopping recording" });
});

app.get("/api/record/status", (req, res) => {
  res.json({
    recording: Boolean(recordingProcess),
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VHS Pi server running on port ${PORT}`);
});
