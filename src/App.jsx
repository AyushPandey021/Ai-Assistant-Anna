import React, { useEffect, useState } from "react";
import AssistantHome from "./components/AssistantHome";
import TalkAssistant from "./components/TalkAssistant";
import ChatAssistant from "./components/ChatAssistant";

const App = () => {
  const [screen, setScreen] = useState(() => {
    return localStorage.getItem("screen") || "home";
  });

  useEffect(() => {
    localStorage.setItem("screen", screen);
  }, [screen]);

  return (
    <>
      {screen === "home" && <AssistantHome setScreen={setScreen} />}
      {screen === "talk" && <TalkAssistant goBack={() => setScreen("home")} />}
      {screen === "chat" && <ChatAssistant goBack={() => setScreen("home")} />}
    </>
  );
};

export default App;
