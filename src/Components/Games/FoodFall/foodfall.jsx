import React, { useEffect, useState } from "react";

import mouse from "../../../Utils/useMousePosition";
import useWindowSize from "../../../Utils/useWindowSize";
import "../games.css";

import plate from "../../SVG/baby-animal-shaped-plate-svgrepo-com.svg";
import burger from "../../SVG/burger-svgrepo-com.svg";
import burrito from "../../SVG/burrito-svgrepo-com.svg";
import donut from "../../SVG/donut-svgrepo-com.svg";
import pizza from "../../SVG/pizza-svgrepo-com.svg";

import fire from "../../SVG/campfire-svgrepo-com.svg";

import tick from "../../SVG/checked-tick-svgrepo-com.svg";
import cross from "../../SVG/cancel-svgrepo-com.svg";

let showInst = true;

// function FoodFall({ handleWin, losePoint, setPaused }) {
function FoodFall() {
  const winSound =
    "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/445974__breviceps__cartoon-slurp.wav";
  const loseSound =
    "https://d2nrcsymqn25pk.cloudfront.net/Assets/Sounds/burn.wav";
  document.body.style.backgroundColor = "#ffb3b3";
  const { x } = mouse();
  const [positionX, setPositionX] = useState(x);
  const buffet = [burger, burrito, donut, pizza, fire];

  const size = useWindowSize();

  const [food, setFood] = useState(buffet[0]);
  const [foodY, setFoodY] = useState(2);
  const [spawnPosition, setSpawnPosition] = useState(10);
  const [foodScale, setFoodScale] = useState(1);

  const [food2, setFood2] = useState(buffet[4]);
  const [foodY2, setFoodY2] = useState(2);
  const [spawnPosition2, setSpawnPosition2] = useState(75);
  const [foodScale2, setFoodScale2] = useState(1);

  const [food3, setFood3] = useState(buffet[2]);
  const [foodY3, setFoodY3] = useState(-20);
  const [spawnPosition3, setSpawnPosition3] = useState(40);
  const [foodScale3, setFoodScale3] = useState(1);

  const [localPause, setLocalPause] = useState(true);

  function handleMove() {
    setPositionX(x - 100);
  }

  useEffect(() => {
    if (localPause === false) {
      let y = 2;
      const foodDrop = setInterval(() => {
        y++;
        setFoodY(y);
        if (y > 100) {
          y = -15;
          setFoodScale(1);
          setFood(buffet[Math.floor(Math.random() * buffet.length)]);
          setSpawnPosition(Math.floor(80 * Math.random()));
        }
      }, 12);
      return () => clearInterval(foodDrop);
    }
  }, [localPause]);

  useEffect(() => {
    if (localPause === false) {
      let y2 = 2;
      const foodDrop = setInterval(() => {
        y2++;
        setFoodY2(y2);
        if (y2 > 100) {
          y2 = -15;
          setFoodScale2(1);
          setFood2(buffet[Math.floor(Math.random() * buffet.length)]);
          setSpawnPosition2(Math.floor(80 * Math.random()));
        }
      }, 15);
      return () => clearInterval(foodDrop);
    }
  }, [localPause]);

  useEffect(() => {
    if (localPause === false) {
      let y3 = 2;
      const foodDrop = setInterval(() => {
        y3++;
        setFoodY3(y3);
        if (y3 > 100) {
          y3 = -15;
          setFoodScale3(1);
          setFood3(buffet[Math.floor(Math.random() * buffet.length)]);
          setSpawnPosition3(Math.floor(80 * Math.random()));
        }
      }, 18);
      return () => clearInterval(foodDrop);
    }
  }, [localPause]);

  useEffect(() => {
    if (
      foodY === 75 &&
      (spawnPosition * size.width) / 100 - x > -200 &&
      (spawnPosition * size.width) / 100 - x < 50
    ) {
      let f = 1;
      let i = 0;
      const scaleInt = setInterval(() => {
        setFoodScale((f -= 0.1));
        i++;
        if (i === 10) {
          clearInterval(scaleInt);
        }
      }, 10);
      if (food.search("fire") === -1) {
        // win()
        let winGame = new Audio(winSound);
        winGame.loop = false;
        winGame.play();
        // handleWin()
      } else {
        // lose()
        let lose = new Audio(loseSound);
        lose.loop = false;
        lose.play();
        // losePoint()
      }
    }
  }, [foodY]);

  useEffect(() => {
    if (
      foodY2 === 75 &&
      (spawnPosition2 * size.width) / 100 - x > -200 &&
      (spawnPosition2 * size.width) / 100 - x < 50
    ) {
      let f = 1;
      let i = 0;
      const scaleInt = setInterval(() => {
        setFoodScale2((f -= 0.1));
        i++;
        if (i === 10) {
          clearInterval(scaleInt);
        }
      }, 10);
      if (food2.search("fire") === -1) {
        // win()
        let winGame = new Audio(winSound);
        winGame.loop = false;
        winGame.play();
        // handleWin()
      } else {
        lose();
        let lose = new Audio(loseSound);
        lose.loop = false;
        lose.play();
        // losePoint()
      }
    }
  }, [foodY2]);

  useEffect(() => {
    if (
      foodY3 === 75 &&
      (spawnPosition3 * size.width) / 100 - x > -200 &&
      (spawnPosition3 * size.width) / 100 - x < 50
    ) {
      let f = 1;
      let i = 0;
      const scaleInt = setInterval(() => {
        setFoodScale3((f -= 0.1));
        i++;
        if (i === 10) {
          clearInterval(scaleInt);
        }
      }, 10);
      if (food3.search("fire") === -1) {
        // win()
        let winGame = new Audio(winSound);
        winGame.loop = false;
        winGame.play();
        // handleWin()
      } else {
        lose();
        let lose = new Audio(loseSound);
        lose.loop = false;
        lose.play();
        // losePoint()
      }
    }
  }, [foodY3]);

  function startGame() {
    setLocalPause(false);
    showInst = false;
    // setPaused(false)
  }

  return (
    <>
      {showInst && (
        <p className="instructionText">
          catch food. don't catch fire. click to start
        </p>
      )}

      <div
        className="foodWrapper"
        onMouseMove={() => handleMove()}
        onClick={() => startGame()}
      >
        <img
          className="plate"
          src={plate}
          alt="plate"
          style={{ left: positionX }}
        />

        <img
          src={food}
          alt="food"
          className="food2"
          style={{
            left: `${spawnPosition}vw`,
            top: `${foodY}vh`,
            transform: `scale(${foodScale}, ${foodScale})`,
          }}
        />

        <img
          src={food2}
          alt="food"
          className="food2"
          style={{
            left: `${spawnPosition2}vw`,
            top: `${foodY2}vh`,
            transform: `scale(${foodScale2}, ${foodScale2})`,
          }}
        />

        <img
          src={food3}
          alt="food"
          className="food2"
          style={{
            left: `${spawnPosition3}vw`,
            top: `${foodY3}vh`,
            transform: `scale(${foodScale3}, ${foodScale3})`,
          }}
        />

        {showInst && (
          <>
            <div className="imgContainer">
              <img alt="tick" className="tick" src={tick} />
              <img alt="cross" className="cross" src={cross} />
            </div>
            <div className="exampleFoodfallContainer">
              <div className="exFoodContainer">
                <img className="exampleFood" src={burger} alt="" />
                <img className="exampleFood" src={pizza} alt="" />
                <img className="exampleFood" src={burrito} alt="" />
                <img className="exampleFood" src={donut} alt="" />
              </div>
              <img className="exampleFood" src={fire} alt="" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default FoodFall;
