import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { BsFilter } from 'react-icons/bs';

const SearchBar = ({ onSearch, onSort, sortBy }) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[4] w-[80%] max-w-3xl">
      <div className="flex items-center gap-4 bg-zinc-700/50 backdrop-blur-sm rounded-xl p-3">
        <div className="flex-1 flex items-center bg-zinc-800 rounded-lg px-4 py-2">
          <FaSearch className="text-zinc-400 mr-3" />
          <input
            type="text"
            placeholder="Search files..."
            className="bg-transparent w-full text-white outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="bg-zinc-800 text-white rounded-lg px-4 py-2 outline-none"
            onChange={(e) => onSort(e.target.value)}
            value={sortBy}
          >
            <option value="name">Name</option>
            <option value="size">Size</option>
            <option value="date">Date</option>
          </select>
          <button className="bg-zinc-800 p-2 rounded-lg">
            <BsFilter className="text-white text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar; 