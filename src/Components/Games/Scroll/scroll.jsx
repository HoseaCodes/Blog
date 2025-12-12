import React, { useEffect, useState } from "react";
import "../games.css";

import animal from "../../SVG/animal-kingdom-coati-svgrepo-com.svg";
import arrow from "../../SVG/arrow-svgrepo-com.svg";
import axe from "../../SVG/axe-svgrepo-com.svg";
import bomb from "../../SVG/fuse-weapon-svgrepo-com.svg";

import cross from "../../SVG/cancel-svgrepo-com.svg";
import mouse from "../../SVG/computer-mouse-with-wheel.svg";

let localPause = true;

// function Scroll({ setPaused, handleWin, losePoint}) {
function Scroll() {
  const ding = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/ding.wav";
  const ugh = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/ugh.wav";
  document.body.style.backgroundColor = "#ffd966";

  const [positionY, setPositionY] = useState(40);
  const [arrowPositionX, setArrowPositionX] = useState(0);
  const [arrowPositionY, setArrowPositionY] = useState(20);
  const [axePositionX, setAxePositionX] = useState(-40);
  const [axePositionY, setAxePositionY] = useState(60);
  const [bombPositionX, setBombPositionX] = useState(-80);
  const [bombPositionY, setBombPositionY] = useState(60);

  useEffect(() => {
    if (!localPause) {
      const int = requestAnimationFrame(() => {
        if (arrowPositionX < 100) {
          setArrowPositionX(arrowPositionX + 1);
        } else {
          setArrowPositionX(-10);
          setArrowPositionY(Math.random() * 90);
        }
      });
    }
  });

  useEffect(() => {
    if (!localPause) {
      const int = requestAnimationFrame(() => {
        if (axePositionX < 100) {
          setAxePositionX(axePositionX + 1);
        } else {
          setAxePositionX(-10);
          setAxePositionY(Math.random() * 90);
        }
      });
    }
  });

  useEffect(() => {
    if (!localPause) {
      const int = requestAnimationFrame(() => {
        if (bombPositionX < 100) {
          setBombPositionX(bombPositionX + 1);
        } else {
          setBombPositionX(-10);
          setBombPositionY(Math.random() * 90);
        }
      });
    }
  });

  useEffect(() => {
    if (
      arrowPositionX === 90 &&
      arrowPositionY - positionY >= -10 &&
      arrowPositionY - positionY <= 10
    ) {
      let loseSound = new Audio(ugh);
      loseSound.loop = false;
      loseSound.play();
    } else if (arrowPositionX === 90) {
      let winSound = new Audio(ding);
      winSound.loop = false;
      winSound.play();
    }
  }, [arrowPositionX]);

  useEffect(() => {
    if (
      axePositionX === 90 &&
      axePositionY - positionY >= -10 &&
      axePositionY - positionY <= 10
    ) {
      let loseSound = new Audio(ugh);
      loseSound.loop = false;
      loseSound.play();
    } else if (axePositionX === 90) {
      let winSound = new Audio(ding);
      winSound.loop = false;
      winSound.play();
    }
  }, [axePositionX]);

  useEffect(() => {
    if (
      bombPositionX === 90 &&
      bombPositionY - positionY >= -10 &&
      bombPositionY - positionY <= 10
    ) {
      let loseSound = new Audio(ugh);
      loseSound.loop = false;
      loseSound.play();
    } else if (bombPositionX === 90) {
      let winSound = new Audio(ding);
      winSound.loop = false;
      winSound.play();
    }
  }, [bombPositionX]);

  function handleScroll(e) {
    if (e.nativeEvent.wheelDelta > 0 && positionY > 0) {
      setPositionY(positionY - 1);
    } else if (e.nativeEvent.wheelDelta < 0 && positionY < 83) {
      setPositionY(positionY + 1);
    }
  }

  function handleClick() {
    localPause = false;
    setTimeout(() => {}, 1500);
    setTimeout(() => {
      localPause = true;
    }, 8500);
  }

  return (
    <div
      onWheel={(e) => handleScroll(e)}
      onClick={() => handleClick()}
      className="scrollContainer"
    >
      {localPause && (
        <p className="instructionText">
          scroll wheel or track pad moves animal. avoid everything. click to
          start
        </p>
      )}
      <img
        className="scrollAnimal"
        style={{ top: `${positionY}vh` }}
        src={animal}
        alt=""
      />
      <img
        className="arrow"
        style={{ right: `${arrowPositionX}vw`, top: `${arrowPositionY}vh` }}
        src={arrow}
        alt=""
      />
      <img
        className="axe"
        style={{ right: `${axePositionX}vw`, top: `${axePositionY}vh` }}
        src={axe}
        alt=""
      />
      <img
        className="bomb"
        style={{ right: `${bombPositionX}vw`, top: `${bombPositionY}vh` }}
        src={bomb}
        alt=""
      />

      {localPause && (
        <>
          <div className="exampleScrollContainer">
            <img alt="cross" className="cross" src={cross} />
            <div className="exFoodContainer">
              <img className="exampleFood" src={arrow} alt="" />
              <img className="exampleFood" src={axe} alt="" />
              <img className="exampleFood" src={bomb} alt="" />
            </div>
          </div>
          <img className="exampleMouse" src={mouse} alt="" />
        </>
      )}
    </div>
  );
}

export default Scroll;
