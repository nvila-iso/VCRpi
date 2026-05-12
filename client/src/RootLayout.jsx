import { Outlet } from "react-router";
import { useState } from "react";
import Nav from "./Nav";

const RootLayout = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [systemStatus, setSystemStatus] = useState("STANDBY");
  const [transferProgress, setTransferProgress] = useState(0);
  return (
    <>
      <div className="bg-[#1F0436] p-5">
        <Nav systemStatus={systemStatus} />
        <div className="text-white">
          <Outlet
            context={{
              isRecording,
              setIsRecording,
              setSystemStatus,
              systemStatus,
              transferProgress,
              setTransferProgress,
            }}
          />
        </div>
      </div>
    </>
  );
};
export default RootLayout;
