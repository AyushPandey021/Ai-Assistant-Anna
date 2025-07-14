import React, { useEffect, useState } from "react";
import axios from "axios";

const TalkAssistant = ({ goBack }) => {
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [listening, setListening] = useState(false);

  const API_KEY = "AIzaSyAbD1lDO-feqzyXHdtf8BG3tqvV0bbBQ4E";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes blob {
        0% { transform: translate(0px, 0px) scale(1); }
        33% { transform: translate(20px, -10px) scale(1.1); }
        66% { transform: translate(-15px, 10px) scale(0.9); }
        100% { transform: translate(0px, 0px) scale(1); }
      }
    `;
    document.head.appendChild(style);

    // Cleanup on unmount (IMPORTANT)
    return () => {
      window.speechSynthesis.cancel(); // Stop AI voice when leaving component
    };
  }, []);

  const handleMicClick = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();
    setListening(true);

    recognition.onresult = async (event) => {
      const voiceText = event.results[0][0].transcript;
      setTranscript(voiceText);
      setListening(false);
      await getAIResponse(voiceText);
    };

    recognition.onerror = () => setListening(false);
  };

  const getAIResponse = async (userText) => {
    try {
      const payload = {
        contents: [{ parts: [{ text: userText }] }],
      };
      const res = await axios.post(url, payload);
      const aiText = res.data.candidates[0].content.parts[0].text;
      setResponse(aiText);
      speak(aiText);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong 😓");
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel(); // Stop any previous speech
    window.speechSynthesis.speak(utterance);
  };

  const handleGoBack = () => {
    window.speechSynthesis.cancel(); // stop speech when going back manually
    goBack();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center px-4 py-8">
      {/* Blob Animation */}
      <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-6">
        <div
          className="absolute inset-0 rounded-full opacity-80 blur-2xl"
          style={{
            background: "radial-gradient(circle at 30% 30%, #93c5fd, #3b82f6)",
            animation: "blob 7s infinite ease-in-out",
          }}
        />
        <div className="absolute inset-0 rounded-full bg-blue-300 mix-blend-overlay"></div>
      </div>

      <h2 className="text-2xl font-bold text-center text-gray-800">🎤 Talking to Anna</h2>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Speak now. Anna will reply with voice.
      </p>

      {/* Mic Button */}
      <button
        onClick={handleMicClick}
        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-full shadow hover:bg-blue-700 transition text-sm"
      >
        {listening ? "🎙️ Listening..." : "🎤 Start Talking"}
      </button>

      {/* Output Section */}
      <div className="mt-6 w-full max-w-sm bg-gray-100 rounded-lg p-4 text-sm">
        {transcript && (
          <p className="mb-2">
            <strong className="text-gray-700">You:</strong> {transcript}
          </p>
        )}
        {response && (
          <p>
            <strong className="text-gray-700">Anna:</strong> {response}
          </p>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="mt-8 w-full max-w-xs bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-full text-sm shadow-lg transition"
      >
        ⬅️ Back to Home
      </button>
    </div>
  );
};

export default TalkAssistant;
