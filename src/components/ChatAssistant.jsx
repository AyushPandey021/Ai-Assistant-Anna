import React, { useEffect, useState } from "react";
import axios from "axios";

const ChatAssistant = ({ goBack }) => {
  const [messages, setMessages] = useState([]); // [{ role: 'user' | 'ai', text: '...' }]
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        contents: [{ parts: [{ text: input }] }],
      };
      const res = await axios.post(url, payload);
      const aiText = res.data.candidates[0].content.parts[0].text;
      const aiMessage = { role: "ai", text: aiText };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "ai", text: "Something went wrong 😓" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4 py-6">
      {/* Blob */}
      <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-3">
        <div
          className="absolute inset-0 rounded-full blur-2xl opacity-80"
          style={{
            background: "radial-gradient(circle at 30% 30%, #c084fc, #8b5cf6)",
            animation: "blob 7s infinite ease-in-out",
          }}
        />
        <div className="absolute inset-0 rounded-full bg-purple-300 mix-blend-overlay" />
      </div>

      {/* Header */}
      <h2 className="text-xl font-bold text-gray-800 text-center">💬 Chat with Anna</h2>
      <p className="text-sm text-gray-500 mt-1 text-center mb-4">Anna will reply in text only.</p>

      {/* Chat Box */}
      <div className="flex flex-col justify-between w-full max-w-md flex-1 bg-gray-50 rounded-xl shadow-inner p-4 mb-4 overflow-y-auto h-[50vh]">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-sm p-2 rounded-lg max-w-[80%] ${
              msg.role === "user"
                ? "self-end bg-indigo-100 text-right"
                : "self-start bg-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 text-sm italic self-start animate-pulse">Anna is typing...</div>
        )}
      </div>

      {/* Input Section */}
      <div className="flex w-full max-w-md gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleEnter}
          type="text"
          placeholder="Ask something..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm"
        />
        <button
          onClick={handleSend}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full text-sm"
        >
          Send
        </button>
      </div>

      {/* Back Button */}
      <button
        onClick={goBack}
        className="mt-8 w-full max-w-xs bg-gray-800 hover:bg-gray-700 text-white py-3 rounded-full text-sm shadow-lg transition"
      >
        ⬅️ Back to Home
      </button>
    </div>
  );
};

export default ChatAssistant;
