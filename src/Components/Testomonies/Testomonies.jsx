import React from 'react';
import '../Testomonies/Testomonies.css'

// local reviews data
const reviews = [
    {
        id: 1,
        name: "susan smith",
        job: "web developer",
        img:
            "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883334/person-1_rfzshl.jpg",
        text:
            "I'm baby meggings twee health goth +1. Bicycle rights tumeric chartreuse before they sold out chambray pop-up. Shaman humblebrag pickled coloring book salvia hoodie, cold-pressed four dollar toast everyday carry",
    },
    {
        id: 2,
        name: "anna johnson",
        job: "web designer",
        img:
            "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883409/person-2_np9x5l.jpg",
        text:
            "Helvetica artisan kinfolk thundercats lumbersexual blue bottle. Disrupt glossier gastropub deep v vice franzen hell of brooklyn twee enamel pin fashion axe.photo booth jean shorts artisan narwhal.",
    },
    {
        id: 3,
        name: "peter jones",
        job: "intern",
        img:
            "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883417/person-3_ipa0mj.jpg",
        text:
            "Sriracha literally flexitarian irony, vape marfa unicorn. Glossier tattooed 8-bit, fixie waistcoat offal activated charcoal slow-carb marfa hell of pabst raclette post-ironic jianbing swag.",
    },
    {
        id: 4,
        name: "bill anderson",
        job: "the boss",
        img:
            "https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883423/person-4_t9nxjt.jpg",
        text:
            "Edison bulb put a bird on it humblebrag, marfa pok pok heirloom fashion axe cray stumptown venmo actually seitan. VHS farm-to-table schlitz, edison bulb pop-up 3 wolf moon tote bag street art shabby chic. ",
    },
];
// select items
const img = document.getElementById("person-img");
const author = document.getElementById("author");
const job = document.getElementById("job");
const info = document.getElementById("info");

const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const randomBtn = document.querySelector(".random-btn");

// set starting item
let currentItem = 0;

// load initial item
// window.addEventListener("DOMContentLoaded", function () {
//     const item = reviews[currentItem];
//     img.src = item.img;
//     author.textContent = item.name;
//     job.textContent = item.job;
//     info.textContent = item.text;
// });

// show person based on item
function showPerson(person) {
    const item = reviews[person];
    img.src = item.img;
    author.textContent = item.name;
    job.textContent = item.job;
    info.textContent = item.text;
}
// show next person
const nextClick = () => {
    nextBtn.addEventListener("click", function () {
        currentItem++;
        if (currentItem > reviews.length - 1) {
            currentItem = 0;
        }
        showPerson(currentItem);
    });
}

// show prev person
const prevClick = () => {
    prevBtn.addEventListener("click", function () {
        currentItem--;
        if (currentItem < 0) {
            currentItem = reviews.length - 1;
        }
        showPerson(currentItem);
    });
}
// show random person
const randomClick = () => {
    currentItem = Math.floor(Math.random() * reviews.length);
    showPerson(currentItem);
};


const Testonomies = () => {
    return (

        <div className='Testonomies-body'>
            <main>
                <section class="Testonomies-container">
                    <div class="Testonomies-title">
                        <h2>our reviews</h2>
                        <div class="Testonomies-underline"></div>
                    </div>
                    <article class="Testonomies-review">
                        <div class="Testonomies-img-container">
                            <img src="Testonomies-person-1.jpeg" id="Testonomies-person-img" alt="" />
                        </div>
                        <h4 id="Testonomies-author">sara jones</h4>
                        <p id="Testonomies-job">ux designer</p>
                        <p id="Testonomies-info">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto
                            asperiores debitis incidunt, eius earum ipsam cupiditate libero?
                            Iste, doloremque nihil?
          </p>
                        <div class="Testonomies-button-container">
                            <button class="Testonomies-prev-btn" onClick={prevClick}>
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <button class="Testonomies-next-btn" onClick={nextClick}>
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                        <button class="Testonomies-random-btn" onClick={randomClick}>surprise me</button>
                    </article>
                </section>
            </main>
        </div>
    )
}
export default Testonomies;