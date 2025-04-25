import React from "react";

const ChatArea = ({ chat }) => (
  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
    {chat.map((item, idx) => (
      <div key={idx}>
        <div className="flex gap-2 items-center">
          <div className="bg-gray-400 text-white rounded-full h-8 w-8 flex items-center justify-center">
            S
          </div>
          <span className="font-medium">{item.question}</span>
        </div>
        <div className="flex gap-2 items-start mt-2">
          <div className="bg-green-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
            ai
          </div>
          <p className="text-gray-800">{item.answer}</p>
        </div>
      </div>
    ))}
  </div>
);

export default ChatArea;
