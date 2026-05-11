import ControlPanel from "../components/ControlPanel";
import { useOutletContext } from "react-router";

const MainPage = () => {
  const { isRecording, setIsRecording } = useOutletContext();

  return (
    <div className="flex flex-col h-full">
      <div className=" mt-3">
        <ControlPanel
          isRecording={isRecording}
          setIsRecording={setIsRecording}
        />
      </div>
    </div>
  );
};
export default MainPage;
