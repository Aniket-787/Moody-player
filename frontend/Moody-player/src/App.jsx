import { useState } from 'react'
import './App.css'
import FacialExpressionDetector from './components/FacialExpressionDetector'
import MoodSongs from './components/MoodSongs'
import Footer from './components/Footer'
function App() {
   const[Songs,setSongs]= useState([])
return (
   <>
   <FacialExpressionDetector setSongs={setSongs}/>
   <MoodSongs Songs={Songs}/>
   <Footer />
   </>
)
}

export default App
