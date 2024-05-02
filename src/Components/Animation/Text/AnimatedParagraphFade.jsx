import React from "react";
import "./AnimatedParagraphFade.css";

export default function AnimatedParagraphFade({ paragraph, visible }) {
  const addDecimalPoint = (number) => {
    const newNum = (number * 0.1).toFixed(2);;
    const numberString = newNum.toString();
    const result = parseFloat(numberString);
    return result;
  };
  const paragraphSplit = paragraph.split(" ");
  return (
    <p
      className={`paragraph-fade ${visible ? "animateText" : ""}`}
      data-js="type"
    >
      {paragraphSplit.map((word, index) => {
        let seconds = addDecimalPoint(index + 1);
        return (
          <span
            key={index}
            style={{
              animation: `fade-in 0.8s ${seconds}s forwards cubic-bezier(0.11, 0, 0.5, 0)`,
            }}
          >
            {word} &nbsp;
          </span>
        );
      })}
    </p>
  );
}
