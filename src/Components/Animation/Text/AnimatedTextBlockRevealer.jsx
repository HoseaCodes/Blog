import React, { useEffect } from "react";
import "./AnimatedTextBlockRevealer.css";

export default function AnimatedTextBlockRevealer({ data }) {
  const COLOR_LIST = ["#1a1e23", "#d0a93a", "#fff", "#206a5d", "#1c1d25"];
  let targetList;

  const init = () => {
    targetList = document.querySelectorAll('[data-js="reveal"]');

    setup();

    window.addEventListener("scroll", onScroll, false);
    window.dispatchEvent(new Event("scroll"));
  };

  useEffect(() => {
    init();
  }, []);

  const getArrayRandomValue = (array) =>
    array[Math.floor(Math.random() * array.length)];

  const setup = () => {
    for (const target of targetList) {
      const content = target.innerHTML;
      const color =
        "revealColor" in target.dataset
          ? target.dataset.revealColor
          : getArrayRandomValue(COLOR_LIST);
      target.innerHTML = `<span data-reveal="content"><div data-reveal="cover" style="background-color:${color}"></div><span data-reveal="text">${content}</span></span>`;
    }
  };

  const onScroll = () => {
    const windowH = window.innerHeight;
    const scrollTop =
      document.documentElement.scrollTop || document.body.scrollTop;
    const isMostScroll = document.body.clientHeight <= scrollTop + windowH;

    for (const target of targetList) {
      if (target.classList.contains("loaded")) continue;

      const rect = target.getBoundingClientRect();
      const top = rect.top + scrollTop;
      if (isMostScroll || top <= scrollTop + windowH * 0.8)
        target.classList.add("loaded");
    }
  };

  document.addEventListener("DOMContentLoaded", init, false);

  return (
    <main className="text-block-container">
      <ul className="text-block-inner">
        {data.map((item, index) => {
          return (
            <li className="text-loading-mask text-block-group" key={index}>
              <div className="text-loading-overlay is-reveal"></div>
              {item.map((text, index) => {
                return (
                  <p
                    className={`${
                      index === 0
                        ? `hero-single-work-title`
                        : `hero-single-work-subtitle`
                    } text-block-paragraph`}
                    data-js="reveal"
                    key={index}
                  >
                    {text}
                  </p>
                );
              })}
            </li>
          );
        })}
        {/* <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            SANDWICHES&nbsp;&amp;&nbsp;PANCAKE
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            GARDEN
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            MORNING&nbsp;&amp;&nbsp;TOMORROW&nbsp;&amp;&nbsp;FRIEND
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            ORANGE&nbsp;&amp;&nbsp;BIRD&nbsp;&amp;&nbsp;SHEEP&nbsp;&amp;&nbsp;CUP&nbsp;&amp;&nbsp;BUS
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            APPLE&nbsp;&amp;&nbsp;FRUIT&nbsp;&amp;&nbsp;CAR
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            CAKE&nbsp;&amp;&nbsp;PICTURE&nbsp;&amp;&nbsp;CAT&nbsp;&amp;&nbsp;STAMP
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            PLANE&nbsp;&amp;&nbsp;BOOK&nbsp;&amp;&nbsp;RACKET&nbsp;&amp;&nbsp;GLASS&nbsp;&amp;&nbsp;BED
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            APPLE
            <br />
            BANANA&nbsp;&amp;&nbsp;PINE APPLE&nbsp;&amp;&nbsp;SHEEP
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            BANANA&nbsp;&amp;&nbsp;PINE APPLE
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            PUMPKIN&nbsp;&amp;&nbsp;TARO&nbsp;&amp;&nbsp;CARROT
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            HORSERADISH&nbsp;&amp;&nbsp;LETTUCE
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            PUMPKIN&nbsp;&amp;&nbsp;TARO&nbsp;&amp;&nbsp;CARROT
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            HORSERADISH&nbsp;&amp;&nbsp;LETTUCE
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            POTATO&nbsp;&amp;&nbsp;BURDOCK
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            EGG&nbsp;&amp;&nbsp;BAG&nbsp;&amp;&nbsp;ROSE&nbsp;&amp;&nbsp;CHAIR&nbsp;&amp;&nbsp;BAT
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            FISH&nbsp;&amp;&nbsp;NOTEBOOK&nbsp;&amp;&nbsp;PENCIL&nbsp;&amp;&nbsp;DOG&nbsp;&amp;&nbsp;DESK
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            WATCH&nbsp;&amp;&nbsp;MITT&nbsp;&amp;&nbsp;MILK&nbsp;&amp;&nbsp;FLOWER
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            DOOR&nbsp;&amp;&nbsp;BOAT&nbsp;&amp;&nbsp;PIANO&nbsp;&amp;&nbsp;
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            POTATO&nbsp;&amp;&nbsp;BURDOCK
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            APPLE
            <br />
            BANANA&nbsp;&amp;&nbsp;PINE APPLE
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            LETTER
            <br />
            CAP&nbsp;&amp;&nbsp;TAPE&nbsp;&amp;&nbsp;MAIL&nbsp;&amp;&nbsp;BOX
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            APPLE
            <br />
            BANANA&nbsp;&amp;&nbsp;PINE APPLE
          </p>
          <p className="text-block-paragraph" data-js="reveal">
            TURNIP&nbsp;&amp;&nbsp;OKRA&nbsp;&amp;&nbsp;PEA
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            SHIITAKE&nbsp;&amp;&nbsp;BEEFSTEAK PLANT
          </p>
        </li>
        <li className="text-block-group">
          <p className="text-block-paragraph" data-js="reveal">
            <a href="https://github.com/okawa-h">GIT&nbsp;HUB</a>
          </p>
        </li> */}
      </ul>
    </main>
  );
}
