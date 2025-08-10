import React, { useEffect, useRef, useState } from "react";
import "./MoodSongs.css";

const MoodSongs = ({ Songs = [] }) => {
  const [isPlaying, setPlaying] = useState(null);
  const audioRefs = useRef([]);

  useEffect(() => {
    // stop audio when song list changes or component unmounts
    return () => {
      audioRefs.current.forEach((a) => { if (a) a.pause(); });
    };
  }, [Songs]);

  const handlePlayPause = (index) => {
    const current = audioRefs.current[index];
    if (!current) return;

    if (isPlaying === index) {
      current.pause();
      setPlaying(null);
    } else {
      
      audioRefs.current.forEach((a, i) => {
        if (a && i !== index) a.pause();
      });
      current.currentTime = 0;
      current.play();
      setPlaying(index);
    }
  };

  const setAudioRef = (el, i) => {
    audioRefs.current[i] = el;
    if (el) {
      el.onended = () => {
        setPlaying((prev) => (prev === i ? null : prev));
      };
    }
  };

  return (
    <div className="mood-songs-container">
      <h2 className="songs-title">Recommended Songs</h2>
      <div className="songs-list">
        {Songs.length === 0 && <p className="no-songs">No songs found for this mood yet.</p>}
        {Songs.map((song, index) => (
          <div className={`song-card ${isPlaying === index ? "playing" : ""}`} key={index}>
            <div className="left">
              <div className="cover">
                {song.cover ? (
                  <img src={song.cover} alt={song.title} />
                ) : (
                  <div className="cover-placeholder">{song.title?.charAt(0) || "♪"}</div>
                )}
              </div>
              <div className="meta">
                <h3 className="song-title">{song.title}</h3>
                <p className="song-artist">{song.artist}</p>
              </div>
            </div>

            <div className="right">
              <audio
                ref={(el) => setAudioRef(el, index)}
                src={song.audio}
                preload="metadata"
              />
              <button className="play-btn" onClick={() => handlePlayPause(index)}>
                {isPlaying === index ? <i className="ri-pause-line"></i> : <i className="ri-play-line"></i>}
              </button>

              <div className="equalizer">
                <span className={`bar ${isPlaying === index ? "active" : ""}`}></span>
                <span className={`bar ${isPlaying === index ? "active" : ""}`}></span>
                <span className={`bar ${isPlaying === index ? "active" : ""}`}></span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodSongs;
