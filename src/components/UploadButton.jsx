import React, { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';

const UploadButton = ({ onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    files.forEach(file => {
      const fileData = {
        id: Date.now(),
        name: file.name,
        desc: `Uploaded file: ${file.name}`,
        filesize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
        date: new Date().toISOString().split('T')[0],
        type: file.name.split('.').pop().toLowerCase(),
        close: false,
        tag: {
          isOpen: true,
          tagTitle: "Just Uploaded",
          tagColor: "blue"
        }
      };
      onUpload(fileData);
    });
  };

  return (
    <div className="fixed bottom-8 right-8 z-[4]">
      <div
        className={`relative group ${isDragging ? 'scale-110' : ''} transition-transform`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
        />
        <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2">
          <FaCloudUploadAlt className="text-2xl" />
          <span className="hidden group-hover:inline">Upload Files</span>
        </button>
      </div>
    </div>
  );
};

export default UploadButton; 