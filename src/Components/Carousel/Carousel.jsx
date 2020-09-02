import React from 'react';
import '../Carousel/Carousel.css';


const slides = [
    {
        title: "Calorie Kictehn",
        subtitle: "Made with JavaScript",
        description: "Solo Project: Calorie Kitchen API - JavaScript, CSS, HTML - Created a single page application with client side rending with API and AJAX capabilities. The API accessed Spoonacular DB JSON data.",
        image:
            "https://i.imgur.com/rzgfTRS.png"
    },

    {
        title: "Career Connect",
        subtitle: "Made with JavaScript & Node.js",
        description: "Solo Project: Career Connect - JavaScript, CSS, HTML, MongoDB, oAuth Google, Node.js, RESTful routing -  Created a web server using a templating engine and MVC model. Building all of the application from beginning to end with an ability to consume a third party API and convert its JSON components.",
        image:
            "https://i.imgur.com/vmlDyZl.png"
    },
    {
        title: "Merge-Immersive",
        subtitle: "Made with React & Node.js",
        description: "Collaborative Project: Merge-Immersive — This application was developed with a full stack MERN M - MongoDB to store data, E - Express, a back-end framework, R - React, a client side framework, N - NodeJS (RESTful routing) - to run back end service and written in JavaScript including JWT authentication . Styling with Bootstrap and CSS.",
        image:
            "https://i.imgur.com/bRK2U7B.png"
    },
    {
        title: "Webfiver",
        subtitle: "Made with Wordpress",
        description: "Content Management System",
        image:
            "https://i.imgur.com/o94rvhP.png"
    },
    {
        title: "Python",
        subtitle: "Made with Python and Django",
        description: "A piece of heaven",
        image:
            "https://i.imgur.com/0lG4Jjw.jpg"
    }
];

function useTilt(active) {
    const ref = React.useRef(null);

    React.useEffect(() => {
        if (!ref.current || !active) {
            return;
        }

        const state = {
            rect: undefined,
            mouseX: undefined,
            mouseY: undefined
        };

        let el = ref.current;

        const handleMouseMove = (e) => {
            if (!el) {
                return;
            }
            if (!state.rect) {
                state.rect = el.getBoundingClientRect();
            }
            state.mouseX = e.clientX;
            state.mouseY = e.clientY;
            const px = (state.mouseX - state.rect.left) / state.rect.width;
            const py = (state.mouseY - state.rect.top) / state.rect.height;

            el.style.setProperty("--px", px);
            el.style.setProperty("--py", py);
        };

        el.addEventListener("mousemove", handleMouseMove);

        return () => {
            el.removeEventListener("mousemove", handleMouseMove);
        };
    }, [active]);

    return ref;
}

const initialState = {
    slideIndex: 0
};

const slidesReducer = (state, event) => {
    if (event.type === "NEXT") {
        return {
            ...state,
            slideIndex: (state.slideIndex + 1) % slides.length
        };
    }
    if (event.type === "PREV") {
        return {
            ...state,
            slideIndex:
                state.slideIndex === 0 ? slides.length - 1 : state.slideIndex - 1
        };
    }
};

function Slide({ slide, offset }) {
    const active = offset === 0 ? true : null;
    const ref = useTilt(active);

    return (
        <div
            ref={ref}
            className="slide"
            data-active={active}
        // style={{
        //     "--offset": offset,
        //     "--dir": offset === 0 ? 0 : offset > 0 ? 1 : -1
        // }}
        >
            <div
                className="slideContent"
                style={{
                    backgroundImage: `url('${slide.image}')`
                }}
            >
                <div className="slideContentInner">
                    <h2 className="slideTitle">{slide.title}</h2>
                    <h3 className="slideSubtitle">{slide.subtitle}</h3>
                    <p className="slideDescription">{slide.description}</p>
                </div>
            </div>
        </div>
    );
}

function Carousel() {
    const [state, dispatch] = React.useReducer(slidesReducer, initialState);

    return (
        <div className='html'>
            <div className='carousel-container'>
                <div className="slides">
                    <button onClick={() => dispatch({ type: "PREV" })}>‹</button>

                    {[...slides, ...slides, ...slides].map((slide, i) => {
                        let offset = slides.length + (state.slideIndex - i);
                        return <Slide slide={slide} offset={offset} key={i} />;
                    })}
                    <button onClick={() => dispatch({ type: "NEXT" })}>›</button>
                </div>
            </div>
        </div>


    );
}

export default Carousel;


