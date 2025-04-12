import React, { useRef, useState } from 'react'
import Card from './Card'
import SearchBar from './SearchBar'
import CreateNoteButton from './CreateNoteButton'
import CreateNoteModal from './CreateNoteModal'

const Forground = () => {
    const ref = useRef(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [sortBy, setSortBy] = useState('name')
    const [showModal, setShowModal] = useState(false)
    const [labels, setLabels] = useState([
        { name: 'work', color: 'blue' },
        { name: 'personal', color: 'purple' },
        { name: 'ideas', color: 'green' },
        { name: 'todo', color: 'yellow' }
    ])
    const [files, setFiles] = useState([])

    const handleCreateNote = () => {
        setShowModal(true)
    }

    const handleSaveNote = ({ title, elements, tag }) => {
        const newNote = {
            id: Date.now(),
            name: title,
            elements: elements,
            filesize: "0KB",
            date: new Date().toISOString().split('T')[0],
            type: "txt",
            tag: tag,
            tagInfo: {
                isOpen: true,
                tagColor: labels.find(l => l.name === tag)?.color || "green"
            }
        }
        setFiles(prev => [newNote, ...prev])
    }

    const handleAddLabel = (newLabel) => {
        setLabels(prev => [...prev, newLabel])
    }

    const handleDeleteNote = (id) => {
        setFiles(prev => prev.filter(file => file.id !== id))
    }

    const handleDrop = (e) => {
        e.preventDefault()
        const droppedFiles = Array.from(e.dataTransfer.files)
        
        droppedFiles.forEach(file => {
            const fileData = {
                id: Date.now(),
                name: file.name,
                elements: [{ type: 'text', content: `Uploaded file: ${file.name}` }],
                filesize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
                date: new Date().toISOString().split('T')[0],
                type: file.name.split('.').pop().toLowerCase(),
                tag: "work",
                tagInfo: {
                    isOpen: true,
                    tagColor: "blue"
                }
            }
            setFiles(prev => [fileData, ...prev])
        })
    }

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const filteredAndSortedData = files
        .filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.desc.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            switch(sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name)
                case 'size':
                    return parseFloat(a.filesize) - parseFloat(b.filesize)
                case 'date':
                    return new Date(b.date) - new Date(a.date)
                default:
                    return 0
            }
        })
    
    return (
        <>
            <SearchBar 
                onSearch={setSearchTerm}
                onSort={setSortBy}
                sortBy={sortBy}
            />
            <div 
                ref={ref} 
                className='fixed top-0 left-0 z-[3] w-full h-full p-5 pt-24 overflow-y-auto overflow-x-hidden text-white'
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-[1400px] mx-auto px-4'>
                    {filteredAndSortedData.map((item) => (
                        <Card 
                            key={item.id} 
                            data={item} 
                            reference={ref} 
                            onDelete={handleDeleteNote}
                        />
                    ))}
                </div>
            </div>
            <CreateNoteButton onClick={handleCreateNote} />
            {showModal && (
                <CreateNoteModal
                    onClose={() => setShowModal(false)}
                    onSave={handleSaveNote}
                    onAddLabel={handleAddLabel}
                    labels={labels}
                />
            )}
        </>
    )
}

export default Forground