import React from "react";
import UploadPDF from "./UploadPDF";
import logo from "../assets/Big-LOGO.png"; // Adjust path as needed
import plusIcon from "../assets/plus.svg";
import docsIcon from "../assets/docs.svg";

const Header = ({ fileName, onUpload }) => {
  return (
    <div className="flex justify-between items-center p-3 md:p-4 shadow-sm">
      {/* Logo */}
      <div className="flex items-center">
        <img src={logo} alt="logo" className="w-25 md:h-10" />
      </div>

      {/* File name and upload button section */}
      <div className="flex items-center gap-4">
        {/* Show filename if available */}
        {fileName && (
          <div className="flex items-center">
            {/* Green-bordered container for docs icon */}
            <div className="flex items-center justify-center w-8 h-8 border rounded-md border-green-500 mr-2">
              {/* Green docs icon */}
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
              title={fileName} // Show full filename on hover
            >
              {fileName}
            </span>
          </div>
        )}

        {/* Upload button - regular on desktop, circular on mobile */}
        <div className="flex items-center">
          {/* Desktop button */}
          <div className="hidden md:block">
            <UploadPDF onUpload={onUpload} />
          </div>

          {/* Mobile circular button */}
          <div className="block md:hidden">
            <div className="relative">
              <label htmlFor="mobile-pdf-upload" className="cursor-pointer">
                <div className="flex items-center justify-center w-10 h-10">
                  <img src={plusIcon} alt="Upload" className="w-5 h-5" />
                </div>
              </label>
              <input
                id="mobile-pdf-upload"
                type="file"
                accept=".pdf"
                className="sr-only"
                onChange={(e) => {
                  if (e.target.files.length > 0) {
                    onUpload(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
