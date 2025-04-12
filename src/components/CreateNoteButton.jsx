import React from 'react';
import { FaPlus } from 'react-icons/fa';

const CreateNoteButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-[4] bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-110"
    >
      <FaPlus className="text-2xl" />
      <span className="hidden sm:inline">Create Note</span>
    </button>
  );
};

export default CreateNoteButton; 