import { useState } from 'react';
import './App.css';
import FacialExpressionDetector from './components/FacialExpressionDetector';
import MoodSongs from './components/MoodSongs';
import Footer from './components/Footer';

function App() {
  const [Songs, setSongs] = useState([]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-title">🎵 Moody Player</h1>
        <p className="app-subtitle">Let your mood decide the music</p>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <section className="detector-section">
          <FacialExpressionDetector setSongs={setSongs} />
        </section>
        <section className="songs-section">
          <MoodSongs Songs={Songs} />
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
