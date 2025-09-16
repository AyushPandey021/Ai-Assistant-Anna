import React, { useEffect } from "react";

const AssistantHome = ({ setScreen }) => {
  useEffect(() => {
    // Floating animation for robot
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex flex-col md:flex-row items-center justify-center px-6 md:px-12 py-10 gap-12">
      
      {/* Left: 3D Robot */}
      <div className="hidden md:flex w-full md:w-1/2 justify-center items-center">
        <iframe
          src="https://my.spline.design/genkubgreetingrobot-a2hUVWPlnA19sgOBQUCUVb1i/"
          frameBorder="0"
          width="100%"
          height="480px"
          className="rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          style={{ animation: "float 5s ease-in-out infinite" }}
        ></iframe>
      </div>

      {/* Right: Intro Section */}
      <div className="w-full md:w-1/2 flex flex-col items-center text-center">
        {/* Branding / Title */}
        <h1 className="text-5xl font-bold tracking-tight text-white mb-4">
          Meet <span className="text-yellow-400">Anna</span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed max-w-md">
          Your AI-powered companion to chat, learn, and explore new ideas — 
          all in real-time with a human-like experience.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <button
            onClick={() => setScreen("talk")}
            className="px-6 py-3 bg-white text-black text-lg font-semibold rounded-xl shadow hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300"
          >
            🎤 Talk to Anna
          </button>
          <button
            onClick={() => setScreen("chat")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white text-lg font-semibold rounded-xl shadow hover:scale-[1.02] transition-all duration-300"
          >
            💬 Chat with Anna
          </button>
        </div>

        {/* Subtext */}
        <p className="mt-6 text-sm text-gray-500">
          Secure • Private • Real-time Conversations
        </p>
      </div>
    </div>
  );
};

export default AssistantHome;
  