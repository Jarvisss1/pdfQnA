import React, { useState } from "react";
import Header from "./components/Header";
import ChatArea from "./components/ChatArea";
import InputBox from "./components/InputBox";

const App = () => {
  const [fileName, setFileName] = useState("No file uploaded");
  const [chat, setChat] = useState([]);

  const handleSend = (entry) => {
    setChat([...chat, entry]);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header fileName={fileName} onUpload={setFileName} />
      <ChatArea chat={chat} />
      <InputBox onSend={handleSend} />
    </div>
  );
};

export default App;
