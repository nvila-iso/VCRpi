import { Outlet } from "react-router";
import { useState } from "react";
import Nav from "./Nav";

const RootLayout = () => {
  const [isRecording, setIsRecording] = useState(false);
  return (
    <>
      <div className="bg-[#1F0436] p-5">
        <Nav isRecording={isRecording} />
        <div className="text-white">
          <Outlet context={{ isRecording, setIsRecording }} />
        </div>
      </div>
    </>
  );
};
export default RootLayout;
