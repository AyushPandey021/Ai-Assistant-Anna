import React, { useEffect } from "react";

const AssistantHome = ({ setScreen }) => {
  useEffect(() => {
    // Inject blob animation CSS only once
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes blob {
        0% {
          transform: translate(0px, 0px) scale(1);
        }
        33% {
          transform: translate(20px, -10px) scale(1.1);
        }
        66% {
          transform: translate(-15px, 10px) scale(0.9);
        }
        100% {
          transform: translate(0px, 0px) scale(1);
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8">
      {/* Blob Animation */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
        <div
          className="absolute inset-0 rounded-full opacity-80 blur-2xl"
          style={{
            background: "radial-gradient(circle at 30% 30%, #fcd34d, #f59e0b)",
            animation: "blob 7s infinite ease-in-out",
          }}
        ></div>
        <div className="absolute inset-0 rounded-full bg-yellow-300 mix-blend-overlay"></div>
      </div>

      {/* Assistant Intro */}
      <p className="text-gray-500 text-sm text-center">
        Hi <strong className="text-black">Buddy!</strong>, I’m{" "}
        <span className="text-yellow-500 font-bold">Anna!</span> Your personal assistant.
      </p>
      <h2 className="text-2xl font-bold mt-3 text-center text-gray-800">
        How can I help you today?
      </h2>

      {/* Buttons */}
      <div className="mt-8 w-full max-w-xs space-y-3">
        <button
          onClick={() => setScreen("talk")}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-full text-sm shadow-lg transition"
        >
          🎤 Talk to Anna
        </button>
        <button
          onClick={() => setScreen("chat")}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-full text-sm shadow-lg transition"
        >
          💬 Chat with Anna
        </button>
      </div>
    </div>
  );
};

export default AssistantHome;
