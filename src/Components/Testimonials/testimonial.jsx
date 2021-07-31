import React from 'react';
import Aaron from '../../icons/aaron.png'
import Chengu from '../../icons/Chengu.png'
import Nathan from '../../icons/Nathan.png'
import './testimonial.css'

const steps = [
    {
        title: "Aaron Rascon",
        fName: 'Aaron',
        description:
            '"Oh man, professional! Knocked this one out of the park. The styling is amazing!! Absolutely wonderful UI."',
        imageUrl:
            Aaron,
        social:
            "https://twitter.com/Arooon08238727",

        isActive: false
    },
    {
        title: "Chengu Kargbo",
        fName: 'Chengu',
        description:
            '"Amazing job! 6 API’s! Nested ajax requests! And a beautiful layout with a video as your header!!! WOW!!"',
        imageUrl:
            Chengu,
        social:
            "https://twitter.com/ChenguKargbo",
        isActive: false
    },

];
const Testimonial = () => {
    return (
        <div id="myTestimonial" class="testimonial-carousel slide" data-ride="carousel"
        data-aos="fade-left"
        data-aos-offset="00"
        data-aos-duration="3000"
        >
            <ol class="carousel-indicators">
                <li data-target="#myTestimonial" data-slide-to="0" class="active"></li>
                <li data-target="#myTestimonial" data-slide-to="1"></li>
                <li data-target="#myTestimonial" data-slide-to="2"></li>
            </ol>
            <div class="carousel-inner">
                <div class="testimonial-item carousel-item active">
                    <div class="img-box"><img src={Nathan} alt="Nathan Childress"/></div>
                    <p class="testimonial-descp">"Liked the color scheme and how you made full use of everything your api collection had to offer. The joke addition adds a little personal connect feeling for the user and all the recipe info is not hidden behind a wall of filter choices."</p>
                    <p class="testimonial-title"><b>Nathan Childress</b>Seo Analyst </p>
                </div>
            {steps.map((step) => {
                return (
                    <>
                     <div class="testimonial-item carousel-item">
                        <div class="img-box"><img src={step.imageUrl} alt=""/></div>
                        <p class="testimonial-descp">{step.description}</p>
                        <p class="testimonial-title"><b>{step.title}</b>Seo Analyst </p>
                    </div>
                    </>
                )
            })}
            </div>  
            <a class="carousel-control left carousel-control-prev" href="#myCarousel" data-slide="prev"> <i class="fa fa-angle-left"></i> </a> 
            <a class="carousel-control right carousel-control-next" href="#myCarousel" data-slide="next"> <i class="fa fa-angle-right"></i> </a>
        </div>
    )
}
export default Testimonial;