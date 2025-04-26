import React, { useEffect, useRef } from "react";
import LOGO_AI from "../assets/LOGO-AI.png"; // Adjust path as needed

const ChatArea = ({ chat }) => {
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // If chat is empty, show a welcome message
  if (!chat || chat.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-center">
        <div className="max-w-md">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Welcome to PDF Q&A
          </h3>
          <p className="text-gray-500">
            Upload a PDF document and ask questions about its content.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 m-4 overflow-y-auto px-3 md:px-6 py-4">
      <div className="max-w-325 mx-auto space-y-6">
        {" "}
        {/* Added container with matching width */}
        {chat.map((item, idx) => (
          <div key={idx} className="mb-6">
            {/* User message */}
            <div className="flex gap-3 items-start mb-12">
              <div className="bg-purple-200 text-purple-700 rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center">
                <span className="font-medium">S</span>
              </div>
              <div className="pt-1">
                <p className="text-gray-800">{item.question}</p>
              </div>
            </div>

            {/* AI response */}
            <div className="flex gap-3 items-start mb-12">
              <div className="rounded-full h-10 w-10 flex-shrink-0 flex items-center justify-center overflow-hidden bg-white border border-gray-200">
                <img
                  src={LOGO_AI}
                  alt="AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-gray-800 pt-1">
                <p className="whitespace-pre-wrap">{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatArea;
