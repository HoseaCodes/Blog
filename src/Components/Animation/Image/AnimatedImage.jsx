import React, { useEffect, useRef } from "react";
import "./AnimatedImage.css";

/*
  AnimatedImage.css leaves .image-wrap at `visibility: hidden` with a collapsed
  clip-path until an `animating` class lands on the .reveal wrapper, so if the
  observer never attaches the image is invisible — not missing, invisible.

  That observer used to be registered inside a `DOMContentLoaded` listener.
  DOMContentLoaded fires exactly once, during the initial HTML parse. It worked
  only as long as this component mounted in that same tick; once the data
  feeding it became an async fetch, the component started mounting well after
  the event had fired, the listener never ran, and every image stayed hidden.

  Registering in useEffect ties the observer to the component's own lifecycle,
  which is correct whenever the data arrives. The observer is also scoped to
  this instance's ref rather than re-querying every `.reveal` in the document,
  so N mounted images no longer create N observers each watching all N nodes.
*/
export default function AnimatedImage({ image, styles, alt = "" }) {
  const revealRef = useRef(null);

  useEffect(() => {
    const el = revealRef.current;
    if (!el) return;

    // No IntersectionObserver (older browsers, some test environments) would
    // otherwise mean a permanently hidden image — show it rather than animate.
    if (typeof IntersectionObserver === "undefined") {
      el.classList.add("animating");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animating");
            return;
          }
          // Only reset when scrolled back above the element, so the reveal
          // replays on the way down but not on the way past.
          if (entry.boundingClientRect.top > 0) {
            entry.target.classList.remove("animating");
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="reveal" ref={revealRef}>
      <div className="image-wrap">
        <img style={styles} src={image} alt={alt} />
      </div>
    </div>
  );
}
