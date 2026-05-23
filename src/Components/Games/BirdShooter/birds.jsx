import React, { useState, useEffect } from "react";
import mouse from "../../../Utils/useMousePosition";
import Bird from "./bird";
import "../games.css";

import crosshairs from "../../SVG/crosshairs-solid-svgrepo-com.svg";
import cloud1 from "../../SVG/cloud-svgrepo-com-2.svg";
import cloud2 from "../../SVG/cloud-svgrepo-com.svg";
import cloud3 from "../../SVG/clouds-cloud-svgrepo-com.svg";

let localPause = false;

// export default function Birds({ setPaused, handleWin }) {
export default function Birds() {
  const gunshot =
    "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/bang.wav";
  const [backgroundColor, setBackgroundColor] = useState("rgb(179, 217, 255)");
  document.body.style.backgroundColor = backgroundColor;
  let [move, setMove] = useState(false);
  // let [win, setWin] = useState(false)
  // let [lose, setLose] = useState(false)
  let [paused, setPaused] = useState(true);
  // let [finalScore, setFinalScore] = useState(0)
  let [reset, setReset] = useState(false);
  let [showTimer, setShowTimer] = useState(true);
  // let counter = 0

  // function handleLose () {
  //     counter++
  //     if (counter === arr.length) {
  //         counter = 0
  //     }
  //     setComponent(arr[counter])
  //     if (counter > 1 && counter < arr.length - 1) {
  //         // play()
  //     }
  //     setPaused(true)
  // }

  let [timer, setTimer] = useState(7);

  useEffect(() => {
    let time;
    if (reset === true) {
      setTimer(7);
    }
    if (paused === true) {
      return null;
    } else if (move === true) {
      clearTimeout(time);
      setMove(false);
      setTimer(7);
    } else if (timer > 0) {
      time = setTimeout(() => setTimer(timer - 1), 1000);
    } else {
      clearTimeout(time);
      setTimer(7);
      // handleLose()
    }
  }, [timer, paused]);
  // let r = 179
  // let g = 217
  // let b = 255

  // useEffect(() => {
  //     if (localPause === false) {
  //         const int = setInterval(() => {
  //                 r -= 5.11
  //                 g -= 3.43
  //                 b -= 0.71
  //                 setBackgroundColor(`rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`)
  //     }, 200);
  //     const time0 = setTimeout(() => {
  //         localPause = true
  //     }, 7000);
  //     return () => clearInterval(int)
  // }
  // }, [localPause])

  const { x, y } = mouse();
  const [positionX, setPositionX] = useState(x);
  const [positionY, setPositionY] = useState(y);

  let birdArray = [
    <Bird randomYindex={40} />,
    // <Bird handleWin={() => handleWin()} randomYindex={40} />
  ];

  const [birds, setBirds] = useState(birdArray);

  useEffect(() => {
    console.log(localPause);
    console.log(birds);

    if (localPause === false) {
      const int = setInterval(() => {
        let randomYindex = Math.floor(Math.random() * 80) - 10;
        // birdArray.push(<Bird handleWin={() => handleWin()} randomYindex={randomYindex} />)
        birdArray.push(<Bird randomYindex={randomYindex} />);
        setBirds([...birdArray]);
      }, 500);
      const to = setTimeout(() => {
        clearInterval(int);
        birdArray = [
          // <Bird handleWin={() => handleWin()} randomYindex={40} />
          <Bird randomYindex={40} />,
        ];
        // setBirds([<Bird handleWin={() => handleWin()} randomYindex={40} />])
        setBirds([<Bird randomYindex={40} />]);
        // localPause = true
      }, 7000);
    }
  }, [localPause]);

  function mouseLock() {
    setPositionX(x - 55);
    setPositionY(y - 55);
  }

  function handleClick() {
    let birdShot = new Audio(gunshot);
    birdShot.loop = false;
    birdShot.play();
    // setPaused(false)
    localPause = false;
  }

  return (
    <div
      className="birdWrapper"
      onMouseMove={() => mouseLock()}
      onClick={() => handleClick()}
    >
      {birds}
      <img
        className="crosshairs"
        src={crosshairs}
        alt=""
        style={{ left: positionX, top: positionY }}
      />
      <img className="cloud cloud1" src={cloud1} alt="" />
      <img className="cloud cloud2" src={cloud2} alt="" />
      <img className="cloud cloud3" src={cloud3} alt="" />
      {localPause && <p className="instructionText">click on the birds</p>}
      <div>
        {showTimer && (
          <span className="time">
            Time left: <strong>{timer}</strong>
          </span>
        )}
      </div>
    </div>
  );
}
