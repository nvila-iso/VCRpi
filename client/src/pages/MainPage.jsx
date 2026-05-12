import ControlPanel from "../components/ControlPanel";
import { useOutletContext } from "react-router";

const MainPage = () => {
  const {
    isRecording,
    setIsRecording,
    setSystemStatus,
    systemStatus,
    transferProgress,
    setTransferProgress,
  } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <div className="mt-3">
        <ControlPanel
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setSystemStatus={setSystemStatus}
          systemStatus={systemStatus}
          transferProgress={transferProgress}
          setTransferProgress={setTransferProgress}
        />
      </div>
    </div>
  );
};

export default MainPage;
