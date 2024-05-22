import React from "react";
import "./testimonial.css";

const Aaron =
  "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/aaron-min.png";
const Chengu =
  "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/Chengu-min.png";
const Nathan =
  "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/Nathan-min.png";

const steps = [
  {
    title: "Aaron Rascon",
    fName: "Aaron",
    description:
      '"Oh man, professional! Knocked this one out of the park. The styling is amazing!! Absolutely wonderful UI."',
    imageUrl: Aaron,
    social: "https://twitter.com/Arooon08238727",

    isActive: false,
  },
  {
    title: "Chengu Kargbo",
    fName: "Chengu",
    description:
      '"Amazing job! 6 API’s! Nested ajax requests! And a beautiful layout with a video as your header!!! WOW!!"',
    imageUrl: Chengu,
    social: "https://twitter.com/ChenguKargbo",
    isActive: false,
  },
];
const Testimonial = () => {
  return (
    <div
      id="myTestimonial"
      className="testimonial-carousel slide"
      data-ride="carousel"
      data-aos="fade-left"
      data-aos-offset="00"
      data-aos-duration="3000"
    >
      <ol className="carousel-indicators">
        <li
          data-target="#myTestimonial"
          data-slide-to="0"
          className="active"
        ></li>
        <li data-target="#myTestimonial" data-slide-to="1"></li>
        <li data-target="#myTestimonial" data-slide-to="2"></li>
      </ol>
      <div className="carousel-inner">
        <div className="testimonial-item carousel-item active">
          <div className="img-box">
            <img src={Nathan} alt="Nathan Childress" />
          </div>
          <p className="testimonial-descp">
            "Liked the color scheme and how you made full use of everything your
            api collection had to offer. The joke addition adds a little
            personal connect feeling for the user and all the recipe info is not
            hidden behind a wall of filter choices."
          </p>
          <p className="testimonial-title">
            <b>Nathan Childress</b>Seo Analyst{" "}
          </p>
        </div>
        {steps.map((step) => {
          return (
            <div className="testimonial-item carousel-item" key={step.title}>
              <div className="img-box">
                <img src={step.imageUrl} alt="" />
              </div>
              <p className="testimonial-descp">{step.description}</p>
              <p className="testimonial-title">
                <b>{step.title}</b>Seo Analyst{" "}
              </p>
            </div>
          );
        })}
      </div>
      <a
        className="carousel-control left carousel-control-prev"
        href="#myCarousel"
        data-slide="prev"
      >
        {" "}
        <i className="fa fa-angle-left"></i>{" "}
      </a>
      <a
        className="carousel-control right carousel-control-next"
        href="#myCarousel"
        data-slide="next"
      >
        {" "}
        <i className="fa fa-angle-right"></i>{" "}
      </a>
    </div>
  );
};
export default Testimonial;
