import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const ChatAssistant = ({ goBack }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesRef = useRef([]);
  const scrollRef = useRef(null);

  const API_KEY = "AIzaSyAbD1lDO-feqzyXHdtf8BG3tqvV0bbBQ4E";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

  useEffect(() => {
    messagesRef.current = messages;
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-12px); }
        100% { transform: translateY(0px); }
      }
      @keyframes scaleIn {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      @keyframes typingBlink {
        0% { opacity: 0.3; }
        50% { opacity: 1; }
        100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const typeWriter = (text, onComplete) => {
    let i = 0;
    let currentText = "";
    const speed = 25;
    const interval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        const updated = [...messagesRef.current];
        updated[updated.length - 1] = { role: "ai", text: currentText };
        messagesRef.current = updated;
        setMessages(updated);
        i++;
      } else {
        clearInterval(interval);
        onComplete && onComplete();
      }
    }, speed);
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setLoading(true);

    try {
      const payload = { contents: [{ parts: [{ text: input }] }] };
      const res = await axios.post(url, payload);
      const aiText =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response received.";

      setMessages((prev) => {
        const newMessages = [...prev, { role: "ai", text: "" }];
        messagesRef.current = newMessages;
        return newMessages;
      });

      typeWriter(aiText);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "⚠️ Something went wrong." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-gray-900 flex flex-col items-center px-4 pt-6 relative">
      {/* Top Back Button */}
      <button
        onClick={goBack}
        className="absolute top-4 left-4 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all duration-300 shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden sm:inline text-sm font-medium">Back</span>
      </button>

      {/* Robot Header */}
      <div
        className="w-56 h-56 mb-6 drop-shadow-xl"
        style={{ animation: "float 5s infinite ease-in-out" }}
      >
        <iframe
          src="https://my.spline.design/genkubgreetingrobot-a2hUVWPlnA19sgOBQUCUVb1i/"
          frameBorder="0"
          width="100%"
          height="100%"
          className="rounded-full"
        ></iframe>
      </div>

      {/* Title */}
      <h2 className="text-4xl font-extrabold text-white text-center mb-1">
        Chat with <span className="text-yellow-400">Anna</span>
      </h2>
      <p className="text-gray-400 text-base mb-4 text-center">
        Real-time answers with a smooth typing effect ✨
      </p>

      {/* Chat + Input Wrapper */}
      <div className="flex flex-col w-full max-w-3xl flex-1">
        {/* Chat Window */}
        <div
          ref={scrollRef}
          className="flex flex-col justify-start flex-1 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl shadow-lg p-5 overflow-y-auto transition-all duration-300"
          style={{ height: "60vh" }}
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{ animation: "scaleIn 0.3s ease" }}
              className={`mb-3 text-base p-3 rounded-xl max-w-[85%] ${
                msg.role === "user"
                  ? "self-end bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
                  : "self-start bg-gray-800 text-gray-100 font-mono leading-relaxed tracking-wide"
              }`}
            >
              {msg.text}
            </div>
          ))}
          {loading && (
            <div
              className="text-gray-400 text-base italic self-start"
              style={{ animation: "typingBlink 1s infinite" }}
            >
              Anna is typing...
            </div>
          )}
        </div>

        {/* Input Bar (Always Visible) */}
        <div className="flex w-full gap-3 mt-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnter}
            type="text"
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-base"
          />
          <button
            onClick={handleSend}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 text-white rounded-full text-base font-semibold transition-all duration-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatAssistant;
