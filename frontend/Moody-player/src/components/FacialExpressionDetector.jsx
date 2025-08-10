import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import "./facialExpressionDetection.css";
import axios from "axios";

const ExpressionDetector = ({ setSongs }) => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("waiting...");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detecting, setDetecting] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
      startVideo();
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch((err) => {
        console.error("Webcam error:", err);
        setExpression("webcam error");
      });
  };

  const detectExpression = async () => {
    if (!modelsLoaded) {
      setExpression("models loading...");
      return;
    }
    const video = videoRef.current;
    if (!video) {
      setExpression("video not ready");
      return;
    }
    try {
      setDetecting(true);
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detection && detection.expressions) {
        const best = Object.entries(detection.expressions).reduce((a, b) =>
          a[1] > b[1] ? a : b
        );
        const mood = best[0];
        setExpression(mood);

        const invalidMoods = [
          "unknown",
          "no face detected",
          "waiting...",
          "error detecting expression",
        ];
        if (!invalidMoods.includes(mood.toLowerCase())) {
          axios
            .get(`http://localhost:3000/songs?mood=${mood}`)
            .then((response) => {
              setSongs(response.data.songs || []);
            })
            .catch((error) => {
              console.error("Axios error:", error);
            });
        } else {
          console.log("Invalid mood detected — skipping API call.");
        }
      } else {
        setExpression("no face detected");
      }
    } catch (err) {
      console.error("Detection error:", err);
      setExpression("error detecting expression");
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="detector-wrapper">
      <div className="brand">
        <div className="brand-left">
          <div className="logo">
            <img
              src="https://cdn-icons-png.flaticon.com/128/13174/13174147.png"
              alt="logo"
            />
          </div>
          <div className="brand-text">
            <h1>Feelify</h1>
            <p>The Moody Player</p>
          </div>
        </div>
        <div className="mood-badge">Mood: <span className="mood-text">{expression}</span></div>
      </div>

      <div className="detector-card">
        <div className="video-frame">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="user-video"
          />
          <div className={`video-overlay ${detecting ? "scanning" : ""}`}>
            {detecting ? <div className="pulse" /> : <i className="ri-eye-line overlay-icon"></i>}
          </div>
        </div>

        <div className="controls">
          <h3 className="current-label">Current Expression</h3>
          <div className="current-expression">{expression}</div>

          <button
            className="detect-btn"
            onClick={detectExpression}
            disabled={detecting}
          >
            {detecting ? "Scanning..." : "Detect Mood"}
            <i className="ri-emotion-line btn-icon"></i>
          </button>

          <p className="hint">Tip: Allow camera access and keep face in center.</p>
        </div>
      </div>
    </div>
  );
};

export default ExpressionDetector;
