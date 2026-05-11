import Library from "./Library";
import Storage from "./Storage";
import SystemInfo from "./SystemInfo";
import VideoPreview from "./VideoPreview";
import AudioLevels from "./AudioLevels";
import TapeInfo from "./TapeInfo";
import SignalStatus from "./SignalStatus";
import TransportControls from "./TransportControls";
import TapeModal from "./TapeModal";

import { useState, useEffect } from "react";

const ControlPanel = ({ isRecording, setIsRecording }) => {
  const [tapes, setTapes] = useState([]);
  const [selectedTapeId, setSelectedTapeId] = useState(null);
  const [isTapeModalOpen, setIsTapeModalOpen] = useState(false);
  const [editingTape, setEditingTape] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    const savedTapes = localStorage.getItem("tapes");

    if (savedTapes) {
      setTapes(JSON.parse(savedTapes));
    }

    setHasLoaded(true);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    localStorage.setItem("tapes", JSON.stringify(tapes));
  }, [tapes, hasLoaded]);

  const onNewTape = () => {
    setIsTapeModalOpen(true);
  };

  const handleEditTape = (tape) => {
    setEditingTape(tape);
    setIsTapeModalOpen(true);
  };

  const handleSaveTape = (formData) => {
    if (editingTape) {
      const updatedTape = {
        ...editingTape,
        title: formData.title,
        length: Number(formData.length),
        condition: formData.condition,
        coverImage: formData.coverPreview || editingTape.coverImage,
        coverFile: formData.coverFile || editingTape.coverFile,
      };

      setTapes((prev) =>
        prev.map((tape) => (tape.id === editingTape.id ? updatedTape : tape)),
      );

      setSelectedTapeId(editingTape.id);
      setEditingTape(null);
      setIsTapeModalOpen(false);
      return;
    }

    const newTape = {
      id: crypto.randomUUID(),
      title: formData.title,
      length: Number(formData.length),
      condition: formData.condition,
      format: "VHS",
      captureDate: new Date().toISOString().slice(0, 10),
      status: "READY",
      coverImage: formData.coverPreview || "/VAS_VHS.png",
      coverFile: formData.coverFile,
    };

    setTapes((prev) => [...prev, newTape]);
    setSelectedTapeId(newTape.id);
    setIsTapeModalOpen(false);
  };

  const handleDeleteTape = () => {
    if (!editingTape) return;

    setTapes((prev) => prev.filter((tape) => tape.id !== editingTape.id));

    setSelectedTapeId(null);
    setEditingTape(null);
    setIsTapeModalOpen(false);
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
        <div className="col-start-2 row-start-1">
          <VideoPreview />
        </div>
        <div className="col-start-2 row-start-2 col-span-2">
          <TransportControls
            isRecording={isRecording}
            setIsRecording={setIsRecording}
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
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ControlPanel;
