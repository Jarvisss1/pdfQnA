import React, { useState } from "react";
import UploadPDF from "./UploadPDF";
import logo from "../assets/Big-LOGO.png"; // Adjust path as needed
import plusIcon from "../assets/plus.svg";
import docsIcon from "../assets/docs.svg";

const Header = ({ fileName, onUpload }) => {
  const [isUploading, setIsUploading] = useState(false);

  // Extract file name safely from various possible inputs
  const getDisplayFileName = (fileInput) => {
    if (!fileInput) return "";

    // If fileInput is a File object, extract the name property
    if (fileInput instanceof File) {
      return fileInput.name;
    }

    // If fileInput is already a string, use it
    if (typeof fileInput === "string" && fileInput !== "No file uploaded") {
      return fileInput;
    }

    return "";
  };

  // Define renderFileInfo function to handle the conditional rendering
  const renderFileInfo = () => {
    const displayName = getDisplayFileName(fileName);

    if (displayName) {
      return (
        <div className="flex items-center">
          <div className="flex items-center justify-center w-8 h-8 border rounded-md border-green-500 mr-2">
            <img
              src={docsIcon}
              alt="Document"
              className="w-5 h-5 text-green-500"
              style={{
                filter:
                  "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(90%) contrast(95%)",
              }}
            />
          </div>

          {/* Filename in green text with truncation */}
          <span
            className="text-sm text-green-600 font-medium truncate max-w-[80px] sm:max-w-[120px] md:max-w-[200px] lg:max-w-none"
            title={displayName} // Show full filename on hover
          >
            {displayName}
          </span>
        </div>
      );
    } else {
      // Return empty fragment when no file is uploaded
      return <></>;
    }
  };

  // Handle file upload with loading state and proper file name extraction
  const handleFileUpload = async (file) => {
    if (!file || isUploading) return;

    try {
      setIsUploading(true);
      // Pass the file object to onUpload
      await Promise.resolve(onUpload(file));
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex justify-between items-center p-3 md:p-4 shadow-sm bg-white">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="logo" className="w-25 md:h-10" />
      </div>

      {/* File name and upload button section */}
      <div className="flex items-center gap-4">
        {/* Show upload indicator or filename */}
        {isUploading ? (
          <div className="flex items-center">
            <div className="flex items-center text-blue-500">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span className="text-sm">Uploading...</span>
            </div>
          </div>
        ) : (
          renderFileInfo()
        )}

        {/* Upload button - regular on desktop, circular on mobile */}
        <div className="flex items-center">
          {/* Desktop button */}
          <div className="hidden md:block">
            <UploadPDF onUpload={handleFileUpload} disabled={isUploading} />
          </div>

          {/* Mobile circular button */}
          <div className="block md:hidden">
            <div className="relative">
              <label
                htmlFor="mobile-pdf-upload"
                className={`cursor-pointer ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <div className="flex items-center justify-center w-10 h-10">
                  {isUploading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <img src={plusIcon} alt="Upload" className="w-5 h-5" />
                  )}
                </div>
              </label>
              <input
                id="mobile-pdf-upload"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files.length > 0 && !isUploading) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                disabled={isUploading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
