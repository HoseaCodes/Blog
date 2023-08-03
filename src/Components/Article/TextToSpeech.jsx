import React, { useState, useEffect } from "react";
import { DisplayItem } from '../../Layout/Text/styledText';
import { AiFillPlayCircle, AiFillPauseCircle, AiFillStop } from 'react-icons/ai';

const TextToSpeech = ({ text }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [utterance, setUtterance] = useState(null);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    
    setUtterance(u);
    setIsPaused(true)

    return () => {
        synth.cancel();
    };
}, [text]);

const handlePlay = () => {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices();
    
    utterance.voice = voices[15];
    utterance.rate = 0.95;

    if (isPaused) {
      synth.resume();
    }

    synth.speak(utterance);

    setIsPaused(false);
  };

  const handlePause = () => {
    const synth = window.speechSynthesis;

    synth.pause();

    setIsPaused(true);
  };

  const handleStop = () => {
    const synth = window.speechSynthesis;

    synth.cancel();

    setIsPaused(true);
  };

  return (
    <div style={{display: 'flex'}}>
      {
        isPaused ?
            <DisplayItem Green onClick={handlePlay}>
                <AiFillPlayCircle style={{fontSize: 'larger'}}/> 
                &nbsp; {isPaused ? "Listen" : "Resume"}
            </DisplayItem>
      :
            <DisplayItem Green onClick={handlePause}>
                <AiFillPauseCircle style={{fontSize: 'larger'}}/> 
                &nbsp; Pause
            </DisplayItem>
      
      }
        &nbsp;&nbsp;
        <DisplayItem Red onClick={handleStop}>
            <AiFillStop style={{fontSize: 'larger'}}/> 
            &nbsp; Stop
        </DisplayItem>
    </div>
  );
};

export default TextToSpeech;