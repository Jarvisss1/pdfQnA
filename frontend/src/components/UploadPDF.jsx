import React from "react";
import plusIcon from "../assets/plus.svg";

const UploadPDF = ({ onUpload }) => {
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="relative">
      <label
        htmlFor="pdf-upload"
        className="flex items-center justify-center px-6 py-3 rounded-xl border-2 border-black bg-white text-black font-medium cursor-pointer hover:bg-gray-50 transition-colors min-w-[180px]"
      >
        <img src={plusIcon} alt="Upload" className="w-5 h-5 mr-3" />
        Upload PDF
      </label>
      <input
        id="pdf-upload"
        type="file"
        accept=".pdf"
        className="sr-only"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadPDF;
