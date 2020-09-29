import React from 'react';
import CarouselCalorieKitchen from '../Carousel/CarouselCalorieKitchen';
import CarouselCareerconnect from '../Carousel/CarouselCareerConnect';
import CarouselMergeImmersive from '../Carousel/CarouselMergeImmersive';
import CarouselWebfiver from '../Carousel/CarouselWebfiver';
import CarouselDevCenter from './CarouselDevCenter';

function Carousel() {

    return (
        <div className='p-container'>
            <div className='p-content'>
                <CarouselCalorieKitchen />
                <div className='p-details'>
                    <h2 className='p-h2'>Calorie Kitchen</h2>
                    <p>This app was built using HTML, CSS, and Javascript.</p>
                    <p>Solo Project: Calorie Kitchen API - JavaScript, CSS, HTML - Created a single page application with client side rending with API and AJAX capabilities. The API accessed Spoonacular DB JSON data.</p>
                    <a className='link' href="https://hoseacodes.github.io/Calorie-Kitchen/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link' href="https://github.com/HoseaCodes/Calorie-Kitchen" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
            <div className='p-content'>
                <CarouselWebfiver />
                <div className='p-details'>
                    <h2 className='p-h2'>Web Fiver</h2>
                    <p>This CMS was built with WordPress.</p>
                    <a className='link' href="http://webfiver.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                </div>
            </div>

            <div className='p-content'>
                <CarouselCareerconnect />
                <div className='p-details'>
                    <h2 className='p-h2'>Career Connect</h2>
                    <p>This app was built using Mongo, ExpressJS, and NodeJS.</p>
                    <p>Solo Project: Career Connect - JavaScript, CSS, HTML, MongoDB, oAuth Google, Node.js, RESTful routing -  Created a web server using a templating engine and MVC model. Building all of the application from beginning to end with an ability to consume a third party API and convert its JSON components.</p>
                    <a className='link' href="https://careerconnect.herokuapp.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link' href="https://github.com/HoseaCodes/CareerConnect" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
            <div className='p-content'>
                <CarouselMergeImmersive />
                <div className='p-details'>
                    <h2 className='p-h2'>Merge Immersive</h2>
                    <p>This app was built with NodeJS for an API back-end and ReactJS for a front-end.</p>
                    <p className='p-extended'>Collaborative Project: Merge-Immersive — This application was developed with a full stack MERN M - MongoDB to store data, E - Express, a back-end framework, R - React, a client side framework, N - NodeJS (RESTful routing) - to run back end service and written in JavaScript including JWT authentication . Styling with Bootstrap and CSS. Problem: Students in the bootcamp have a difficult time connecting with current and past students including students from different disciplines. Another challenge is maintaining the ability to communicate and collaborate on projects. Solution:  Our application gives GA students the ability to see their current projects, websites and applications. Also, giving them the ability to reach out to current and past students even students that are not in their program type like Software Engineering and Data Science. Allowing students to connect and build a stronger network.</p>
                    <a className='link' href="http://www.mergeimmersive.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link' href="https://github.com/HoseaCodes/merge-immersive" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
            <div className='p-content'>
                <CarouselDevCenter />
                <div className='p-details'>
                    <h2 className='p-h2'>Dev Center</h2>
                    <p>This application was developed with a full stack Python, Django, Social oAuth, Tweepy, Boto3, JWT .</p>
                    <p className='p-extended'>Collabrative Project: DevCenter - Styling with Bootstrap, Materialize and CSS. Problem: Devs have multiple tabs windows open while attempting to do there job. Solution: To create an app that would allow the users to authenticate with other applications and then be able to use some base functionality of those sites via a third party API. </p>
                    <a className='link' href="https://devcenter-629.herokuapp.com/" target="_blank" rel="noopener noreferrer">View Live Site</a>
                    <a className='link' href="https://github.com/HoseaCodes/DevCenter" target="_blank" rel="noopener noreferrer">View Github</a>
                </div>
            </div>
        </div>
    )
}

export default Carousel;