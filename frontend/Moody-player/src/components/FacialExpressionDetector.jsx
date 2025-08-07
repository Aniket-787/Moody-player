import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import './facialExpressionDetection.css';
import axios from 'axios';


const ExpressionDetector = ({ setSongs }) => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Waiting...");
  const [modelsLoaded, setModelsLoaded] = useState(false);

  
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      startVideo();
    };

    loadModels();
  }, []);

  
  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Webcam error:", err);
        setExpression("Webcam error");
      });
  };

 
  const detectExpression = async () => {
    if (!modelsLoaded) {
      setExpression("Models not loaded yet...");
      return;
    }

    const video = videoRef.current;
    if (!video) {
      setExpression("Video not ready");
      return;
    }

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection && detection.expressions) {
        const best = Object.entries(detection.expressions).reduce((a, b) =>
          a[1] > b[1] ? a : b
        );
        const mood = best[0];
        setExpression(mood);

       
        const invalidMoods = [ "unknown", "No face detected", "Waiting...", "Error detecting expression"];
        if (!invalidMoods.includes(mood)) {
          axios.get(`http://localhost:3000/songs?mood=${mood}`)
            .then(response => {
              console.log(response.data.songs);
              setSongs(response.data.songs);
            })
            .catch(error => {
              console.error("Axios error:", error);
            });
        } else {
          console.log("Invalid mood, skipping API call.");
        }
      } else {
        setExpression("No face detected");
      }
    } catch (err) {
      console.error("Detection error:", err);
      setExpression("Error detecting expression");
    }
  };

  return (
    <>
   <div className="logo">
    <div className="icon">
      <img src="https://cdn-icons-png.flaticon.com/128/13174/13174147.png" alt="" />
    </div>
    <div className='logo-text'>
    <h1>Feelify</h1>
    <p>The Moody Player</p>
    </div>
   </div>
    <div className='mood-element'>
     
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className='user-video-feed'
      />
      <br />
      <div className="expression-box">
         <h2 className='mood-box'>Current Expression: {expression}</h2>
      <button
        onClick={detectExpression}
        className='mood-element-btn'
      >
        Detect Mood 😊
      </button>
      </div>
     
    </div>
    </>
  );
};

export default ExpressionDetector;
