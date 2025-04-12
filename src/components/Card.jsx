import React, { useState } from 'react'
import { FaRegFileAlt, FaFilePdf, FaFileWord, FaFileArchive, FaFilePowerpoint, FaShare, FaDownload, FaTrash, FaEdit, FaCheck, FaPlus } from 'react-icons/fa'
import { motion } from "framer-motion"

const getFileIcon = (type) => {
  switch(type) {
    case 'pdf':
      return <FaFilePdf className="text-2xl text-red-500" />
    case 'docx':
      return <FaFileWord className="text-2xl text-blue-500" />
    case 'zip':
      return <FaFileArchive className="text-2xl text-yellow-500" />
    case 'pptx':
      return <FaFilePowerpoint className="text-2xl text-orange-500" />
    case 'txt':
      return <FaRegFileAlt className="text-2xl text-gray-400" />
    case 'image':
      return <FaRegFileAlt className="text-2xl text-pink-500" />
    case 'todo':
      return <FaCheck className="text-2xl text-green-500" />
    default:
      return <FaRegFileAlt className="text-2xl text-gray-400" />
  }
}

const getTagColor = (tag) => {
  switch(tag) {
    case 'personal':
      return 'bg-purple-600'
    case 'work':
      return 'bg-blue-600'
    case 'ideas':
      return 'bg-green-600'
    case 'todo':
      return 'bg-yellow-600'
    default:
      return 'bg-gray-600'
  }
}

const Card = ({data, reference, onDelete}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(data.name)
  const [editedElements, setEditedElements] = useState(data.elements || [{ type: 'text', content: '' }])
  const [editedTag, setEditedTag] = useState(data.tag)

  const handleDownload = () => {
    if (data.type === 'txt') {
      const blob = new Blob([editedElements[0].content], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = editedName
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      alert('Download functionality for this file type is not implemented yet')
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: editedName,
        text: editedElements.map(el => el.type === 'text' ? el.content : '').join('\n'),
        url: window.location.href
      })
    } else {
      alert('Sharing is not supported in your browser')
    }
  }

  const handleSave = () => {
    data.name = editedName.trim() || "Untitled Note"
    data.elements = editedElements
    data.tag = editedTag
    setIsEditing(false)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      onDelete(data.id)
    }
  }

  const handleElementChange = (index, value) => {
    const newElements = [...editedElements]
    newElements[index].content = value
    setEditedElements(newElements)
  }

  const handleTodoItemChange = (elementIndex, itemIndex, value) => {
    const newElements = [...editedElements]
    newElements[elementIndex].content[itemIndex].text = value
    setEditedElements(newElements)
  }

  const handleTodoCheckChange = (elementIndex, itemIndex, checked) => {
    const newElements = [...editedElements]
    newElements[elementIndex].content[itemIndex].checked = checked
    setEditedElements(newElements)
  }

  const addTodoItem = (elementIndex) => {
    const newElements = [...editedElements]
    newElements[elementIndex].content.push({ text: '', checked: false })
    setEditedElements(newElements)
  }

  return (
    <motion.div 
      drag 
      dragConstraints={reference} 
      whileDrag={{scale: 1.1}} 
      className='relative flex-shrink-0 w-72 bg-zinc-900/90 text-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow'
      data-id={data.id}
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          {getFileIcon(data.type)}
          <span className="text-xs text-zinc-400">{data.date}</span>
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full bg-zinc-800 text-white rounded p-2 mb-2"
            placeholder="Enter title..."
            autoFocus
          />
        ) : (
          <h3 
            className="text-lg font-semibold mb-2 truncate cursor-pointer hover:text-blue-400"
            onClick={() => setIsEditing(true)}
          >
            {editedName}
          </h3>
        )}
        
        <div className="space-y-3 mb-3">
          {editedElements.map((element, elementIndex) => (
            <div key={elementIndex} className="relative group">
              {element.type === 'text' && (
                isEditing ? (
                  <textarea
                    value={element.content}
                    onChange={(e) => handleElementChange(elementIndex, e.target.value)}
                    className="w-full bg-zinc-800 text-white rounded p-2 h-24 resize-none"
                    placeholder="Start typing..."
                  />
                ) : (
                  <p className="text-sm leading-tight text-zinc-400">
                    {element.content}
                  </p>
                )
              )}
              {element.type === 'todo' && (
                <div className="space-y-2">
                  {element.content.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={(e) => handleTodoCheckChange(elementIndex, itemIndex, e.target.checked)}
                        className="w-4 h-4"
                        disabled={!isEditing}
                      />
                      {isEditing ? (
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => handleTodoItemChange(elementIndex, itemIndex, e.target.value)}
                          className="flex-1 bg-zinc-800 text-white rounded p-2"
                          placeholder={`Todo item ${itemIndex + 1}`}
                        />
                      ) : (
                        <span className={`text-sm ${item.checked ? 'line-through text-zinc-500' : 'text-zinc-300'}`}>
                          {item.text}
                        </span>
                      )}
                    </div>
                  ))}
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => addTodoItem(elementIndex)}
                      className="flex items-center gap-2 text-blue-400 hover:text-blue-300"
                    >
                      <FaPlus size={12} />
                      Add Item
                    </button>
                  )}
                </div>
              )}
              {element.type === 'image' && (
                <div className="relative">
                  <img 
                    src={element.content} 
                    alt="Note image" 
                    className="w-full h-32 object-cover rounded"
                  />
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => {
                          const newElements = editedElements.filter((_, i) => i !== elementIndex)
                          setEditedElements(newElements)
                        }}
                        className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-zinc-500">{data.filesize}</span>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors"
                >
                  <span className="text-white text-sm">✓</span>
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <span className="text-white text-sm">✕</span>
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-600 transition-colors"
                >
                  <FaEdit size=".8em" color='#fff' />
                </button>
                <button 
                  onClick={handleShare}
                  className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-600 transition-colors"
                >
                  <FaShare size=".8em" color='#fff' />
                </button>
                <button 
                  onClick={handleDownload}
                  className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center hover:bg-zinc-600 transition-colors"
                >
                  <FaDownload size=".8em" color='#fff' />
                </button>
                <button 
                  onClick={handleDelete}
                  className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  <FaTrash size=".8em" color='#fff' />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={`w-full py-2 ${getTagColor(data.tag)} flex items-center justify-center`}>
        <h3 className='text-sm font-semibold capitalize'>{data.tag}</h3>
      </div>
    </motion.div>
  )
}

export default Card