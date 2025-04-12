import React, { useState, useRef } from 'react';
import { FaTimes, FaImage, FaPlus, FaListUl } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CreateNoteModal = ({ onClose, onSave, onAddLabel, labels }) => {
  const [title, setTitle] = useState('');
  const [selectedTag, setSelectedTag] = useState('work');
  const [newLabelName, setNewLabelName] = useState('');
  const [newLabelColor, setNewLabelColor] = useState('blue');
  const [showNewLabelForm, setShowNewLabelForm] = useState(false);
  const [elements, setElements] = useState([{ type: 'text', content: '' }]);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      onSave({ 
        title, 
        elements,
        tag: selectedTag
      });
      onClose();
    }
  };

  const handleAddNewLabel = () => {
    if (newLabelName.trim()) {
      onAddLabel({ name: newLabelName.toLowerCase(), color: newLabelColor });
      setNewLabelName('');
      setShowNewLabelForm(false);
    }
  };

  const handleElementChange = (index, value) => {
    const newElements = [...elements];
    newElements[index].content = value;
    setElements(newElements);
  };

  const handleTodoCheckChange = (elementIndex, itemIndex, checked) => {
    const newElements = [...elements];
    newElements[elementIndex].content[itemIndex].checked = checked;
    setElements(newElements);
  };

  const handleTodoItemChange = (elementIndex, itemIndex, value) => {
    const newElements = [...elements];
    newElements[elementIndex].content[itemIndex].text = value;
    setElements(newElements);
  };

  const addTodoItem = (elementIndex) => {
    const newElements = [...elements];
    newElements[elementIndex].content.push({ text: '', checked: false });
    setElements(newElements);
  };

  const handleImageUpload = (e, elementIndex) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newElements = [...elements];
        newElements[elementIndex].content = reader.result;
        setElements(newElements);
      };
      reader.readAsDataURL(file);
    }
  };

  const addElement = (type) => {
    const newElement = { type, content: type === 'todo' ? [] : '' };
    setElements([...elements, newElement]);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="bg-zinc-900 p-6 rounded-lg w-full max-w-md text-white"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">Create New Note</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-zinc-800 text-white rounded p-2"
              placeholder="Enter title..."
              required
            />
          </div>

          <div className="mb-4">
            <div className="space-y-4">
              {/* Default text area always shows first */}
              <textarea
                value={elements[0].content}
                onChange={(e) => handleElementChange(0, e.target.value)}
                className="w-full bg-zinc-800 text-white rounded p-2 h-32 resize-none"
                placeholder="Start typing..."
              />
              
              {/* Additional elements (after index 0) */}
              {elements.slice(1).map((element, idx) => {
                const elementIndex = idx + 1; // Offset by 1 since we're showing first element separately
                return (
                  <div key={element.id || elementIndex} className="relative group">
                    {element.type === 'todo' && (
                      <div className="space-y-2">
                        {element.content.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={(e) => handleTodoCheckChange(elementIndex, itemIndex, e.target.checked)}
                              className="w-4 h-4"
                            />
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => handleTodoItemChange(elementIndex, itemIndex, e.target.value)}
                              className="flex-1 bg-zinc-800 text-white rounded p-2"
                              placeholder={`Todo item ${itemIndex + 1}`}
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addTodoItem(elementIndex)}
                          className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                        >
                          <FaPlus size={12} />
                          <span className="text-white">Add Item</span>
                        </button>
                      </div>
                    )}
                    {element.type === 'image' && (
                      <div className="flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full bg-zinc-800 text-white rounded p-2 flex items-center justify-center gap-2 hover:bg-zinc-700"
                        >
                          <FaImage />
                          Choose Image
                        </button>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => handleImageUpload(e, elementIndex)}
                          accept="image/*"
                          className="hidden"
                        />
                        {element.content && (
                          <img
                            src={element.content}
                            alt="Preview"
                            className="max-h-48 rounded"
                          />
                        )}
                      </div>
                    )}
                    <div className="absolute -right-2 -top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          const newElements = elements.filter((_, i) => i !== elementIndex);
                          setElements(newElements);
                        }}
                        className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-2 mt-4 border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => addElement('todo')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700"
              >
                <FaListUl size={16} />
                <span>Todo List</span>
              </button>
              <button
                type="button"
                onClick={() => addElement('image')}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 text-white rounded-lg text-sm hover:bg-zinc-700"
              >
                <FaImage size={16} />
                <span>Image</span>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-white">Label</label>
            <div className="flex gap-2 mb-2">
              {labels.map((label) => (
                <button
                  key={label.name}
                  type="button"
                  onClick={() => setSelectedTag(label.name)}
                  className={`px-3 py-1 rounded-full text-sm text-white ${
                    selectedTag === label.name
                      ? `bg-${label.color}-600`
                      : `bg-${label.color}-600/50`
                  }`}
                >
                  {label.name}
                </button>
              ))}
            </div>
            {!showNewLabelForm ? (
              <button
                type="button"
                onClick={() => setShowNewLabelForm(true)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                + Add New Label
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newLabelName}
                  onChange={(e) => setNewLabelName(e.target.value)}
                  className="flex-1 bg-zinc-800 text-white rounded p-2 text-sm"
                  placeholder="Label name..."
                />
                <select
                  value={newLabelColor}
                  onChange={(e) => setNewLabelColor(e.target.value)}
                  className="bg-zinc-800 text-white rounded p-2 text-sm text-white"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="green">Green</option>
                  <option value="yellow">Yellow</option>
                  <option value="red">Red</option>
                  <option value="pink">Pink</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddNewLabel}
                  className="px-3 py-1 bg-blue-600 rounded-full text-sm text-white"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default CreateNoteModal; 