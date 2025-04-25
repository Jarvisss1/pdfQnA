import React, { useState } from "react";
import axios from "axios";

const InputBox = ({ onSend }) => {
  const [question, setQuestion] = useState("");
  const [error, setError] = useState(null); // <-- state for error

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
    <div className="border-t p-4 flex flex-col">
      <div className="flex">
        <input
          className="flex-1 border rounded px-4 py-2"
          placeholder="Send a message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="ml-2 px-4 bg-blue-500 text-white rounded"
          onClick={handleSend}
        >
          ➤
        </button>
      </div>
      {error && <div className="mt-2 text-red-500 text-sm">⚠️ {error}</div>}
    </div>
  );
};

export default InputBox;
