import { API_BASE } from "../config";

import Library from "./Library";
import Storage from "./Storage";
import SystemInfo from "./SystemInfo";
import VideoPreview from "./VideoPreview";
import AudioLevels from "./AudioLevels";
import TapeInfo from "./TapeInfo";
import SignalStatus from "./SignalStatus";
import TransportControls from "./TransportControls";
import TapeModal from "./TapeModal";
import RecordingTimer from "./RecordingTimer";
import TransferProgress from "./TransferProgress";

import { useState, useEffect } from "react";

const ControlPanel = ({
  isRecording,
  setIsRecording,
  setSystemStatus,
  systemStatus,
  transferProgress,
  setTransferProgress,
}) => {
  const [tapes, setTapes] = useState([]);
  const [selectedTapeId, setSelectedTapeId] = useState(null);
  const [isTapeModalOpen, setIsTapeModalOpen] = useState(false);
  const [editingTape, setEditingTape] = useState(null);

  useEffect(() => {
    fetchTapes();
  }, []);

  useEffect(() => {
    fetchSystemStatus();

    const interval = setInterval(() => {
      fetchSystemStatus();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (systemStatus !== "RECORDING" && systemStatus !== "TRANSFERRING") {
      return;
    }

    const interval = setInterval(() => {
      fetchTapes();
    }, 1000);

    return () => clearInterval(interval);
  }, [systemStatus]);

  const fetchTapes = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/tapes`);
      const data = await response.json();

      setTapes(data);
    } catch (error) {
      console.error("Failed to fetch tapes:", error);
    }
  };

  const fetchSystemStatus = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/system/status`);
      const data = await response.json();

      setSystemStatus(data.status);
    } catch (error) {
      console.error("Failed to fetch system status:", error);
    }
  };

  const updateTape = async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/api/tapes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const updatedTape = await response.json();

      setTapes((prev) =>
        prev.map((tape) => (tape.id === id ? updatedTape : tape)),
      );

      return updatedTape;
    } catch (error) {
      console.error("Failed to update tape:", error);
    }
  };

  const uploadTapeCover = async (tapeId, coverFile) => {
    if (!coverFile) return null;

    const formData = new FormData();
    formData.append("cover", coverFile);

    const response = await fetch(`${API_BASE}/api/tapes/${tapeId}/cover`, {
      method: "POST",
      body: formData,
    });

    return await response.json();
  };

  const onNewTape = () => {
    setIsTapeModalOpen(true);
  };

  const handleEditTape = (tape) => {
    setEditingTape(tape);
    setIsTapeModalOpen(true);
  };

  const handleSaveTape = async (formData) => {
    try {
      if (editingTape) {
        const updatedTapeData = {
          ...editingTape,
          title: formData.title,
          length: Number(formData.length),
          condition: formData.condition,
          coverImage: editingTape.coverImage || "/VAS_VHS.png",
        };

        const response = await fetch(
          `${API_BASE}/api/tapes/${editingTape.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedTapeData),
          },
        );

        let updatedTape = await response.json();

        if (formData.coverFile) {
          updatedTape = await uploadTapeCover(
            updatedTape.id,
            formData.coverFile,
          );
        }

        setTapes((prev) =>
          prev.map((tape) => (tape.id === editingTape.id ? updatedTape : tape)),
        );

        setSelectedTapeId(updatedTape.id);
        setEditingTape(null);
        setIsTapeModalOpen(false);

        return;
      }

      const newTapeData = {
        title: formData.title,
        length: Number(formData.length),
        condition: formData.condition,
        format: "VHS",
        captureDate: new Date().toISOString().slice(0, 10),
        status: "READY",
        coverImage: "/VAS_VHS.png",
      };

      const response = await fetch(`${API_BASE}/api/tapes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTapeData),
      });

      let newTape = await response.json();

      if (formData.coverFile) {
        newTape = await uploadTapeCover(newTape.id, formData.coverFile);
      }

      setTapes((prev) => [...prev, newTape]);
      setSelectedTapeId(newTape.id);
      setIsTapeModalOpen(false);
    } catch (error) {
      console.error("Failed to save tape:", error);
    }
  };

  const handleDeleteTape = async () => {
    if (!editingTape) return;

    try {
      await fetch(`${API_BASE}/api/tapes/${editingTape.id}`, {
        method: "DELETE",
      });

      setTapes((prev) => prev.filter((tape) => tape.id !== editingTape.id));

      setSelectedTapeId(null);
      setEditingTape(null);
      setIsTapeModalOpen(false);
    } catch (error) {
      console.error("Failed to delete tape:", error);
    }
  };

  const handleTransferTape = async () => {
    if (!editingTape) return;

    try {
      setSystemStatus("TRANSFERRING");
      setTransferProgress(0);
      setIsTapeModalOpen(false);

      const response = await fetch(
        `${API_BASE}/api/tapes/${editingTape.id}/transfer`,
        {
          method: "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setSystemStatus("ERROR");
        console.error(data.error);
        return;
      }

      setTapes((prev) =>
        prev.map((tape) => (tape.id === editingTape.id ? data.tape : tape)),
      );

      let progress = 0;

      const interval = setInterval(async () => {
        progress += 10;
        setTransferProgress(progress);

        if (progress >= 100) {
          clearInterval(interval);

          await fetchTapes();

          setSystemStatus("STANDBY");
          setTransferProgress(0);
        }
      }, 300);
    } catch (error) {
      setSystemStatus("ERROR");
      console.error("Failed to transfer tape:", error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-[400px_1fr_300px] grid-rows-[1fr_1fr] gap-5 relative">
        <div className="flex flex-col gap-3 col-start-1 row-start-1">
          <Library
            tapes={tapes}
            selectedTapeId={selectedTapeId}
            setSelectedTapeId={setSelectedTapeId}
            onNewTape={onNewTape}
            onEditTape={handleEditTape}
          />
          <Storage />
        </div>
        <div className="col-start-1 row-start-2">
          <SystemInfo />
        </div>
        <div className="col-start-2 row-start-1 flex flex-col gap-3">
          <VideoPreview />
          <div className="flex justify-between gap-3">
            <RecordingTimer
              isRecording={isRecording}
              startedAt={
                tapes.find((tape) => tape.id === selectedTapeId)
                  ?.recordingStartedAt
              }
            />

            <TransferProgress
              systemStatus={systemStatus}
              transferProgress={transferProgress}
            />
          </div>
        </div>
        <div className="col-start-2 row-start-2 col-span-2">
          <TransportControls
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            tapes={tapes}
            selectedTapeId={selectedTapeId}
            setTapes={setTapes}
            setSystemStatus={setSystemStatus}
            updateTape={updateTape}
          />
        </div>
        <div className="flex flex-col gap-3 col-start-3 row-start-1">
          <AudioLevels />
          <SignalStatus />
          <TapeInfo tapes={tapes} selectedTapeId={selectedTapeId} />
        </div>
        {isTapeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsTapeModalOpen(false)}
            />

            <div className="relative z-10">
              <TapeModal
                tapeToEdit={editingTape}
                onSave={handleSaveTape}
                onDelete={handleDeleteTape}
                onCancel={() => {
                  setEditingTape(null);
                  setIsTapeModalOpen(false);
                }}
                onTransfer={handleTransferTape}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ControlPanel;
