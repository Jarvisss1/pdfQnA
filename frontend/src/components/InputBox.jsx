import React, { useState, useRef } from "react";
import axios from "axios";
import sendIcon from "../assets/send.svg"; // Adjust path as needed

const InputBox = ({ onSend }) => {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState(null);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSend = async () => {
    if (!question.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:8000/api/ask",
        { question },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      onSend(res.data);
      setQuestion("");
      setError(null); // clear error on success
    } catch (err) {
      const message =
        err.response?.data?.detail?.[0]?.msg || "Something went wrong.";
      setError(message); // set error message
    }
  };

  return (
    <div className="p-4 pb-9">
      <div className="relative flex items-center max-w-325 mx-auto shadow-sm bg-white rounded-lg">
        <input
          ref={inputRef}
          className={`w-full py-3 px-4 pl-8 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-black-100 focus:border-black-100 ${
            !isFocused ? "bg-gray-50" : "bg-white"
          }`}
          placeholder="Send a message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <button
          className="absolute right-3 p-1.5 rounded-full focus:outline-none"
          onClick={handleSend}
        >
          <img
            src={sendIcon}
            alt="Send"
            className="w-6 h-6 text-gray-500 hover:cursor-pointer mr-3"
          />
        </button>
      </div>
      {error && (
        <div className="max-w-4xl mx-auto mt-2 text-red-500 text-sm">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default InputBox;
