import React from "react";
import "./AnimatedImage.css";

export default function AnimatedImage({ image, styles }) {
  document.addEventListener("DOMContentLoaded", function () {
    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.4,
    };

    let revealCallback = (entries) => {
      entries.forEach((entry) => {
        let container = entry.target;

        if (entry.isIntersecting) {
          container.classList.add("animating");
          return;
        }

        if (entry.boundingClientRect.top > 0) {
          container.classList.remove("animating");
        }
      });
    };

    let revealObserver = new IntersectionObserver(revealCallback, options);

    document.querySelectorAll(".reveal").forEach((reveal) => {
      revealObserver.observe(reveal);
    });
  });

  return (
    <div class="reveal">
      <div class="image-wrap">
        <img style={styles} src={image} />
      </div>
    </div>
  );
}
