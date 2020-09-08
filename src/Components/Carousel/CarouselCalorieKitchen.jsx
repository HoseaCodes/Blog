import React from 'react'
import '../Carousel/Carousel.css'
import '../Carousel/Modal.css'
import { useState } from 'react';
import ImgComp from './ImgComp';
// import Popup from 'reactjs-popup';
import CalorieKitchen from '../../icons/CalorieKitchen.png'
import CaloriesKitchen2 from '../../icons/CaloriesKitchen2.png'
import caloriekitchen2 from '../../icons/caloriekitchen2.png'
import caloriekitchen3 from '../../icons/caloriekitchen3.png'
import caloriekitchen4 from '../../icons/caloriekitchen4.png'


function Carousel() {
    let example = [
        <ImgComp className='cover' src={CalorieKitchen} />,
        <ImgComp className='cover' src={CaloriesKitchen2} />,
        <ImgComp className='cover' src={caloriekitchen2} />,
        <ImgComp className='cover' src={caloriekitchen3} />,
        <ImgComp className='cover' src={caloriekitchen4} />,

    ];
    const [x, setX] = useState(0)
    const goLeft = () => {
        x === 0 ? setX(-100 * (example.length - 1)) : setX(x + 100);
    };
    const goRight = () => {
        x === -100 * (example.length - 1) ? setX(0) : setX(x - 100);

    };
    return (
        <div className='carousel-container'>
            <div className='carousel'>
                {example.map((item, index) => {
                    return (
                        <div key={index} className='slide' style={{ transform: `translateX(${x}%)` }}>
                            {item}
                        </div>
                    )
                })}
                <button className='btn-left' onClick={goLeft}> ‹ </button>
                <button className='btn-right' onClick={goRight}> › </button>
            </div>
            {/* <P1Modal /> */}
        </div>
    )
}






// const P1Modal = () => (
//     <Popup
//         trigger={<button className="button"> 🔍 </button>}
//         modal
//         nested
//     >
//         {close => (
//             <div className="modal">
//                 <a className="close" onClick={close}>
//                     &times;
// </a>
//                 <div className="top"> Modal Title </div>
//                 <div className="middle">
//                     {' '}
//                     <p></p>
//                     This app was built using HTML, CSS, and Javascript.
//   Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, a nostrum.
//   Dolorem, repellat quidem ut, minima sint vel eveniet quibusdam voluptates
//   delectus doloremque, explicabo tempore dicta adipisci fugit amet dignissimos?
//   <br />
//   Solo Project: Calorie Kitchen API - JavaScript, CSS, HTML - Created a single page application with client side rending with API and AJAX capabilities. The API accessed Spoonacular DB JSON data.
//   Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequatur sit
//   commodi beatae optio voluptatum sed eius cumque, delectus saepe repudiandae
//   explicabo nemo nam libero ad, doloribus, voluptas rem alias. Vitae?
// </div>
//                 <div className="actions">
//                     <Popup
//                         trigger={<button className="button"> Trigger </button>}
//                         position="top center"
//                         nested
//                     >
//                         <span>
//                             Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
//                             magni omnis delectus nemo, maxime molestiae dolorem numquam
//                             mollitia, voluptate ea, accusamus excepturi deleniti ratione
//                             sapiente! Laudantium, aperiam doloribus. Odit, aut.
//     </span>
//                     </Popup>
//                     <button
//                         className="button"
//                         onClick={() => {
//                             console.log('modal closed ');
//                             close();
//                         }}
//                     >
//                         close modal
//   </button>
//                 </div>
//             </div>
//         )}
//     </Popup>
// );

export default
    Carousel
    // P1Modal
