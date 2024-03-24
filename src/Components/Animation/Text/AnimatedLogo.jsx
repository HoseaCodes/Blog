import React, { useEffect } from "react";
import "./AnimatedLogo.css";

export default function AnimatedLogo() {
    const animationRef = React.useRef();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const em = animationRef.current.style;
            em.setProperty("--before-display", "none");
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [animationRef.current]);
  return (
    <div className="logo-container">
      <div className="inner-logo">
        <h1 className="animatedlogo">
          <em>H</em>
          <em ref={animationRef} className="planet left">
            O
          </em>
          <em>S</em>
          <em>E</em>
          <em>A</em>
          <em>&nbsp;&nbsp;</em>
          <em>C</em>
          <em className="planet right">O</em>
          <em>D</em>
          <em>E</em>
          <em>S</em>
        </h1>
      </div>
    </div>
  );
}
