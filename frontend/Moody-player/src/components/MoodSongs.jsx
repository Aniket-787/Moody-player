import React, { useState } from 'react'
import './MoodSongs.css'

const MoodSongs = ({Songs}) => {
   const [isPlaying , setPlaying] = useState(null)

   const handlePlayPause = (index) =>{
    if(isPlaying === index){
      setPlaying(null);
    }
    else{
      setPlaying(index);
    }
   };
  return (
    <div className='mood-songs'>
        <h2>Recommended Songs</h2>
            {Songs.map((song,index)=>{
             return (
             <div className='song' key={index}>
                <div className="title">
                    <h3>{song.title}</h3>
                    <p>{song.artist}</p>
                    
                </div>
                <div className="play-pause-btn">{
                    isPlaying === index &&
                     <audio src={song.audio} 
                     style ={{display:"none"}}
                     autoPlay={isPlaying=== index}
                     >
                     </audio>
                  }
                  <button onClick={()=>handlePlayPause(index)}>
                   {isPlaying ===index ?
                   <i class="ri-pause-large-fill"></i>
                   :<i class="ri-play-large-line"></i> 
                   }
                  </button>
                 

                </div>

             </div>)
            })}
         
    </div>
  )
}

export default MoodSongs;