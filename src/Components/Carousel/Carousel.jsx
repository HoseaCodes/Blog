import React from "react";
import { useCarousel } from "use-carousel-hook";
import "./Carousel.css";
import { Button } from "../Button/Button";

const Carousel = (props) => {
  const { items } = props;
  const { ref, previous, next, setCurrent, reset } = useCarousel();

  const perviousButtonRef = React.useRef();
  const nextButtonRef = React.useRef();
  return (
    <div className="carousel">
      <ul ref={ref} className="carousel__list">
        {items.map((item) => (
          <li className="carousel__item" key={item.id}>
            <figure className="carousel__item__figure">
              <div className="carousel__item__img-wrapper">
                <div className="carousel__item__img-inner">
                  <img
                    className="carousel__item__img"
                    src={item.image.src}
                    alt={item.image.alt}
                  />
                </div>
              </div>
              <figcaption className="carousel__item__figcaption">
                {item.caption}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      <div>
        <Button
          ref={perviousButtonRef}
          style={{ borderColor: "#d0a93a", color: "#1c1d25" }}
          onMouseOver={() => {
            perviousButtonRef.style.color = "#fff",
            perviousButtonRef.style.backgroundColor = "#d0a93a"
          }
          }
          label="Previous"
          onClick={() => previous()}
        />
        &nbsp;&nbsp;&nbsp;
        {/* <Button primary label="Go back 2 items" onClick={() => previous(2)} /> */}
        <Button
          ref={nextButtonRef}
          style={{ borderColor: "#d0a93a", color: "#1c1d25" }}
          onMouseOver={() => {
            nextButtonRef.style.backgroundColor = "#fff"
            nextButtonRef.style.color = "#d0a93a"
          }
          }
          label="Next"
          onClick={() => next()}
        />
        {/* <Button primary label="Go forward 2 items" onClick={() => next(2)} /> */}
        {/* <Button primary label="Reset" onClick={() => reset()} /> */}
        {/* <Button primary label="Set index to 2" onClick={() => setCurrent(2)} /> */}
      </div>
    </div>
  );
};

export default Carousel;
