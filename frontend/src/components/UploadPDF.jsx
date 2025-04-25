import React from "react";
import axios from "axios";

const UploadPDF = ({ onUpload }) => {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name); // ✅ Add this line

    try {
      const res = await axios.post(
        "http://localhost:8000/api/upload-pdf/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      onUpload(file.name);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console for details.");
    }
  };


  return (
    <label className="cursor-pointer border p-2 rounded bg-gray-100">
      Upload PDF
      <input type="file" hidden onChange={handleUpload} />
    </label>
  );
};

export default UploadPDF;
