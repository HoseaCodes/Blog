import React from 'react';
import CarouselCalorieKitchen from '../Carousel/CarouselCalorieKitchen';
import CarouselCareerconnect from '../Carousel/CarouselCareerConnect';
import CarouselMergeImmersive from '../Carousel/CarouselMergeImmersive';
import CarouselWebfiver from '../Carousel/CarouselWebfiver';

function Carousel() {

    return (
        <div className='p-container'>
            <div className='group1'>
                <div className='p-content'>
                    <CarouselCalorieKitchen />
                    <h2>Calorie Kitchen</h2>
                    <hr />
                    <p>This app was built using HTML, CSS, and Javascript.</p>
                    <p>Solo Project: Calorie Kitchen API - JavaScript, CSS, HTML - Created a single page application with client side rending with API and AJAX capabilities. The API accessed Spoonacular DB JSON data.</p>
                    <a href="https://hoseacodes.github.io/Calorie-Kitchen/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a href="https://github.com/HoseaCodes/Calorie-Kitchen" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
                <div className='p-content'>
                    <CarouselWebfiver />
                    <h2>Web Fiver</h2>
                    <hr />
                    <p>This CMS was built with WordPress.</p>
                    <a href="http://webfiver.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>

                </div>

            </div>
            <div className='group 2'>
                <div className='p-content'>
                    <CarouselCareerconnect />
                    <h2>Career Connect</h2>
                    <hr />
                    <p>This app was built using Mongo, ExpressJS, and NodeJS.</p>
                    <p>Solo Project: Career Connect - JavaScript, CSS, HTML, MongoDB, oAuth Google, Node.js, RESTful routing -  Created a web server using a templating engine and MVC model. Building all of the application from beginning to end with an ability to consume a third party API and convert its JSON components.</p>
                    <a href="https://careerconnect.herokuapp.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a href="https://github.com/HoseaCodes/CareerConnect" target="_blank" rel="noopener noreferrer">View Github</a>

                </div>
                <div className='p-content'>
                    <CarouselMergeImmersive />
                    <h2>Merge Immersive</h2>
                    <hr />
                    <p>This app was built with NodeJS for an API back-end and ReactJS for a front-end.</p>
                    <p>Collaborative Project: Merge-Immersive — This application was developed with a full stack MERN M - MongoDB to store data, E - Express, a back-end framework, R - React, a client side framework, N - NodeJS (RESTful routing) - to run back end service and written in JavaScript including JWT authentication . Styling with Bootstrap and CSS. Problem: Students in the bootcamp have a difficult time connecting with current and past students including students from different disciplines. Another challenge is maintaining the ability to communicate and collaborate on projects. Solution:  Our application gives GA students the ability to see their current projects, websites and applications. Also, giving them the ability to reach out to current and past students even students that are not in their program type like Software Engineering and Data Science. Allowing students to connect and build a stronger network.</p>
                    <a href="http://www.mergeimmersive.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a href="https://github.com/HoseaCodes/merge-immersive" target="_blank" rel="noopener noreferrer">View Github</a>

                </div>

            </div>
        </div>
    )
}

export default Carousel;