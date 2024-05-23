import { use } from "marked";
import React, { useEffect, useState } from "react";
// import "./AudioPlayer.css";

const AutoplayAudio = ({ src }) => {
    const [hover, setHover] = useState(false);
  useEffect(() => {
    // Access the audio element using the ref
    const audioElement = document.getElementById("autoplay-audio");

    // Start playing the audio when the component mounts
    audioElement.play();

    // Optionally, you can pause or stop the audio when the component unmounts
    return () => {
      audioElement.pause(); // Pause the audio
      audioElement.currentTime = 0; // Optionally reset the audio to the beginning
    };
  }, []); // Run this effect only once, when the component mounts

    useEffect(() => {
         const audioElement = document.getElementById("autoplay-audio");
        if (hover) {
           audioElement.play();
        } else {
           audioElement.pause();
        }
    }
    , [hover])
  return (
    <audio
      id="autoplay-audio"
      src={src}
          autoPlay
          controls
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      Your browser does not support the audio element.
    </audio>
  );
};

export default AutoplayAudio;
