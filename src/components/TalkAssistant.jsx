import React, { useEffect, useState } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const TalkAssistant = ({ goBack }) => {
  const [listening, setListening] = useState(false);

  const API_KEY = "AIzaSyAbD1lDO-feqzyXHdtf8BG3tqvV0bbBQ4E";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(1); opacity: 0.7; }
      }
    `;
    document.head.appendChild(style);
    return () => window.speechSynthesis.cancel();
  }, []);

  const handleMicClick = () => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const voiceText = event.results[0][0].transcript;
      setListening(false);
      await getAIResponse(voiceText);
    };

    recognition.onerror = () => setListening(false);
  };

  const getAIResponse = async (userText) => {
    try {
      const payload = { contents: [{ parts: [{ text: userText }] }] };
      const res = await axios.post(url, payload);
      const aiText = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      speak(aiText);
    } catch (err) {
      speak("Sorry, something went wrong.");
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.pitch = 1.1;
    utterance.rate = 1.05;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleGoBack = () => {
    window.speechSynthesis.cancel();
    goBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex flex-col items-center justify-center relative px-4">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="absolute top-4 left-4 flex items-center gap-2 px-5 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 shadow-lg backdrop-blur-md"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline font-medium text-sm">Back</span>
      </button>

      {/* Robot */}
      <div
        className="w-80 h-80 sm:w-[22rem] sm:h-[22rem] mb-10 drop-shadow-2xl"
        style={{ animation: "float 5s infinite ease-in-out" }}
      >
        <iframe
          src="https://my.spline.design/genkubgreetingrobot-a2hUVWPlnA19sgOBQUCUVb1i/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="rounded-full"
        />
      </div>

      {/* Mic Button */}
      <button
        onClick={handleMicClick}
        className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full flex items-center justify-center text-5xl shadow-2xl transition-all duration-300 ${
          listening
            ? "bg-red-500 ring-8 ring-red-400 animate-pulse"
            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-110"
        }`}
        style={{ animation: listening ? "pulse 1s infinite" : "none" }}
      >
        🎤
      </button>

      {/* Status Text */}
      <p className="text-gray-300 mt-6 text-lg sm:text-xl font-medium text-center">
        {listening ? "Listening..." : "Tap & speak with Anna"}
      </p>
    </div>
  );
};

export default TalkAssistant;
