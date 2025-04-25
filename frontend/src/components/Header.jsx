import React from "react";
import UploadPDF from "./UploadPDF";
import logo from "../assets/react.svg";

const Header = ({ fileName, onUpload }) => (
  <div className="flex justify-between items-center p-4 border-b">
    <img src={logo} alt="logo" className="h-10" />
    <div className="flex items-center gap-4">
      <span>{fileName}</span>
      <UploadPDF onUpload={onUpload} />
    </div>
  </div>
);

export default Header;
