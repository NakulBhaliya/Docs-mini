import React, { useRef, useState } from 'react'
import Card from './Card'

const Forground = () => {

    const ref = useRef(null)
    const data = [
        {desc: "this is bg color color card display", 
            filesize: ".12mb", 
            close: false, 
            tag: {isOpen: true, tagTitle: "Download Now", tagColor: "green" }},
        {desc: "this is bg color color card display", 
            filesize: ".9mb", 
            close: true, 
            tag: {isOpen: true, tagTitle: "Share Now", tagColor: "blue" }},
        {desc: "this is bg color color card display", 
            filesize: ".2mb", 
            close: true, 
            tag: {isOpen: false, tagTitle: "Download Now", tagColor: "green" }},
    ]
    
  return (
        <div ref={ref} className='fixed top-0 left-0 z-[3] w-full h-full flex gap-10 flex-wrap p-5 '>
            {data.map((item, index)=>(
                <Card data={item} reference={ref} />
            ))}
        </div>
  )
}

export default Forground