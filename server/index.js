const fs = require("fs");
const path = require("path");
const { randomUUID } = require("crypto");

const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const multer = require("multer");

const DATA_DIR = path.join(process.cwd(), "data");
const TAPES_FILE = path.join(DATA_DIR, "tapes.json");
const RECORDINGS_DIR = path.join(process.cwd(), "recordings");
const NAS_DIR = path.join(process.cwd(), "nas");

const readTapes = () => {
  if (!fs.existsSync(TAPES_FILE)) {
    fs.writeFileSync(TAPES_FILE, "[]");
  }

  const data = fs.readFileSync(TAPES_FILE, "utf-8");
  return JSON.parse(data);
};

const writeTapes = (tapes) => {
  fs.writeFileSync(TAPES_FILE, JSON.stringify(tapes, null, 2));
};

const coverStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), "uploads", "covers");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.params.id}${ext}`);
  },
});

const syncTapeLocations = (tapes) => {
  return tapes.map((tape) => {
    if (!tape.recordings?.length) return tape;

    const updatedRecordings = tape.recordings.map((recording) => {
      const piPath = path.join(RECORDINGS_DIR, recording.filename);
      const nasPath = path.join(NAS_DIR, recording.filename);

      if (fs.existsSync(piPath)) {
        return {
          ...recording,
          status: "ON_PI",
        };
      }

      if (fs.existsSync(nasPath)) {
        return {
          ...recording,
          status: "ON_NAS",
        };
      }

      return {
        ...recording,
        status: "MISSING",
      };
    });

    const latestRecording = updatedRecordings[updatedRecordings.length - 1];

    return {
      ...tape,
      status: latestRecording.status,
      recordings: updatedRecordings,
    };
  });
};

const uploadCover = multer({ storage: coverStorage });

const app = express();
const PORT = 5174;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

let recordingProcess = null;

let activeTransfer = null;

let recordingState = {
  active: false,
  startedAt: null,
  filename: null,
};

app.post("/api/record/start", (req, res) => {
  if (recordingProcess) {
    return res.status(400).json({ error: "Recording already in progress" });
  }

  if (activeTransfer) {
    return res
      .status(400)
      .json({ error: "Cannot record while transfer is active" });
  }

  const { name, minutes = 120, countdown = 10 } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Tape name is required" });
  }

  recordingState = {
    active: true,
    startedAt: new Date().toISOString(),
    filename: null,
  };

  const scriptPath = path.join(__dirname, "../scripts/record.sh");

  recordingProcess = spawn(scriptPath, [name, minutes, countdown], {
    cwd: path.join(__dirname, "../scripts"),
  });

  recordingProcess.on("error", (err) => {
    console.error("Failed to start record.sh", err.message);
    recordingProcess = null;

    recordingState = {
      active: false,
      startedAt: null,
      filename: null,
    };
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

    recordingState = {
      active: false,
      startedAt: null,
      filename: null,
    };
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

  recordingState = {
    active: false,
    startedAt: null,
    filename: null,
  };

  res.json({ ok: true, message: "Stopping recording" });
});

app.get("/api/record/status", (req, res) => {
  res.json({
    recording: Boolean(recordingProcess),
  });
});

app.get("/api/system/status", (req, res) => {
  let status = "STANDBY";

  if (recordingState.active) {
    status = "RECORDING";
  }

  if (activeTransfer) {
    status = "TRANSFERRING";
  }

  res.json({
    status,
    recording: recordingState,
    transfer: activeTransfer,
  });
});

app.get("/api/tapes", (req, res) => {
  const tapes = readTapes();
  const syncedTapes = syncTapeLocations(tapes);

  writeTapes(syncedTapes);

  res.json(syncedTapes);
});

app.post("/api/tapes", (req, res) => {
  const tapes = readTapes();

  const newTape = {
    id: randomUUID(),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tapes.push(newTape);
  writeTapes(tapes);

  res.json(newTape);
});

app.put("/api/tapes/:id", (req, res) => {
  const tapes = readTapes();
  const { id } = req.params;

  const tapeIndex = tapes.findIndex((tape) => tape.id === id);

  if (tapeIndex === -1) {
    return res.status(404).json({ error: "Tape not found" });
  }

  tapes[tapeIndex] = {
    ...tapes[tapeIndex],
    ...req.body,
    id,
    updatedAt: new Date().toISOString(),
  };

  writeTapes(tapes);

  res.json(tapes[tapeIndex]);
});

app.delete("/api/tapes/:id", (req, res) => {
  const tapes = readTapes();
  const { id } = req.params;

  const filteredTapes = tapes.filter((tape) => tape.id !== id);

  if (filteredTapes.length === tapes.length) {
    return res.status(404).json({ error: "Tape not found" });
  }

  writeTapes(filteredTapes);

  res.json({ success: true });
});

app.post("/api/tapes/:id/cover", uploadCover.single("cover"), (req, res) => {
  const tapes = readTapes();
  const { id } = req.params;

  if (!req.file) {
    return res.status(400).json({ error: "No cover file uploaded" });
  }

  const tapeIndex = tapes.findIndex((tape) => tape.id === id);

  if (tapeIndex === -1) {
    return res.status(404).json({ error: "Tape not found" });
  }

  const coverImage = `/uploads/covers/${req.file.filename}`;

  tapes[tapeIndex] = {
    ...tapes[tapeIndex],
    coverImage,
    updatedAt: new Date().toISOString(),
  };

  writeTapes(tapes);

  res.json(tapes[tapeIndex]);
});

app.post("/api/tapes/:id/transfer", async (req, res) => {
  const tapes = readTapes();
  const { id } = req.params;

  if (recordingState.active) {
    return res
      .status(400)
      .json({ error: "Cannot transfer while recording is active" });
  }

  if (activeTransfer) {
    return res.status(400).json({ error: "Transfer already in progress" });
  }

  const tapeIndex = tapes.findIndex((tape) => tape.id === id);

  if (tapeIndex === -1) {
    return res.status(404).json({ error: "Tape not found" });
  }

  const tape = tapes[tapeIndex];
  const latestRecording = tape.recordings?.[tape.recordings.length - 1];

  if (!latestRecording) {
    return res.status(400).json({ error: "No recording found for this tape" });
  }

  const sourcePath = path.join(RECORDINGS_DIR, latestRecording.filename);
  const destinationPath = path.join(NAS_DIR, latestRecording.filename);

  if (!fs.existsSync(sourcePath)) {
    return res.status(404).json({
      error: "Recording file not found",
      path: sourcePath,
    });
  }

  if (!fs.existsSync(NAS_DIR)) {
    fs.mkdirSync(NAS_DIR, { recursive: true });
  }

  activeTransfer = {
    tapeId: id,
    filename: latestRecording.filename,
    startedAt: new Date().toISOString(),
  };

  tapes[tapeIndex] = {
    ...tape,
    status: "TRANSFERRING",
    recordings: tape.recordings.map((recording, index, arr) =>
      index === arr.length - 1
        ? { ...recording, status: "TRANSFERRING" }
        : recording,
    ),
    updatedAt: new Date().toISOString(),
  };

  writeTapes(tapes);

  try {
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await fs.promises.copyFile(sourcePath, destinationPath);

    const sourceStats = await fs.promises.stat(sourcePath);
    const destinationStats = await fs.promises.stat(destinationPath);

    if (sourceStats.size !== destinationStats.size) {
      throw new Error("Transferred file size does not match source");
    }

    await fs.promises.unlink(sourcePath);

    const latestTapes = readTapes();
    const latestTapeIndex = latestTapes.findIndex((tape) => tape.id === id);

    latestTapes[latestTapeIndex] = {
      ...latestTapes[latestTapeIndex],
      status: "ON_NAS",
      recordings: latestTapes[latestTapeIndex].recordings.map(
        (recording, index, arr) =>
          index === arr.length - 1
            ? {
                ...recording,
                status: "ON_NAS",
                nasPath: destinationPath,
                transferredAt: new Date().toISOString(),
              }
            : recording,
      ),
      updatedAt: new Date().toISOString(),
    };

    writeTapes(latestTapes);
    activeTransfer = null;

    res.json({
      ok: true,
      message: "Transfer complete",
      tape: latestTapes[latestTapeIndex],
    });
  } catch (error) {
    console.error("Transfer failed:", error);
    activeTransfer = null;

    return res.status(500).json({
      error: "Transfer failed",
      details: error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`VHS Pi server running on port ${PORT}`);
});
