import React from 'react'
import './AnimatedTextSlide.css'

export default function AnimatedTextSlide({topText, bottomText}) {
    return (
      <>
        {/* <div id="text-slide">
          <div class="title">
            <div class="title-inner">
              <div class="cafe">
                <div class="cafe-inner">{topText}</div>
              </div>
              <div class="mozart">
                <div class="mozart-inner">{bottomText}</div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="text-loading-mask cafe">
          <div className="text-loading-overlay is-reveal"></div>
          <h1 className="hero-single-work-title cafe-inner">{topText}</h1>
        </div>
        <div className="text-loading-mask mozart">
          <div className="text-loading-overlay is-reveal"></div>
          <h3 className="hero-single-work-subtitle mozart-inner">
            {bottomText}
          </h3>
        </div>
      </>
    );
}