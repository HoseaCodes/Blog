import styles from './Game.module.css';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from "framer-motion";
import AnimatedGamePage from './AnimatedGamePage';
import { ReactComponent as Arrow } from "./image/arrow.svg";
import { ReactComponent as Up } from "./image/up.svg";
import { ReactComponent as Down } from "./image/down.svg";
import { ReactComponent as Like } from "./image/like.svg";
import Slider from './Slider';
import games from '../../Constants/games';
import AnimatedText from './AnimatedText';
import { ReactComponent as Add } from "./image/add.svg";
import templateGame from '../../Utils/templateGame';
import { Link } from "react-router-dom";
import GameComponent from './GameComponent';
import styled from 'styled-components';

const GamePage = props => {
  const {
    handleHover,
    hoverState,
    handleHome,
    landingPage,
    cartAmount,
    cart,
    search,
    searching,
    handleSearch,
    handleSearchSubmit,
    browsing,
    handleBrowse,
    selectedGame,
    setSelectedGame,
    allGames,
    // extended,
    // setExtended,
    handleAddToCart,
    handleLike,
    // textExtended,
    // setTextExtended,
    handleOpenCart,
    handleCloseCart,
    cartDisplayed,
    clearCart,
    handleRemoveFromCart,
    openGamePage
  } = props;

//   let { gameId } = useParams();
//   const location = useLocation();
  const params = useParams()

  const [carouselState, setCarouselState] = useState(0);
  const [currentGame, setCurrentGame] = useState();
  const [extended, setExtended] = useState(false);
  const [textExtended, setTextExtended] = useState(false);

  const incrementCarousel = (e) => {
    if (carouselState === 3) {
      setCarouselState(0);
    } else {
      setCarouselState(carouselState + 1);
    }
  }

  const decrementCarousel = (e) => {
    if (carouselState === 0) {
      setCarouselState(3);
    } else {
      setCarouselState(carouselState - 1);
    }
  }

  const extendText = () => {
    setTextExtended(!textExtended);
  }

  const handleExtend = (e) => {
    if (document.getElementById("20").innerHTML === "More") {
      document.getElementById("20").className="aboutBottom";
    } else if (document.getElementById("20").innerHTML === "Hide") {
        document.getElementById("20").className="aboutBottomClosed";
    }
    setExtended(!extended);
    if (textExtended === false) {
      setTimeout(extendText, 500);
    } else {
        setTextExtended(!textExtended);
    }
  }

useEffect(() => {
    if (params.id) {
        games.forEach(game => {
            if (game.id == params.id) setCurrentGame(game)
        })
    }
}, [params.id])


  
const GameContainer = styled.div`
width: 60%;
display: flex;
align-self: center;
justify-content: center;
`;
  return (
    <>
        <div className={styles.gamepage}>
            <AnimatedGamePage>
              <div className={styles.gamepageContent}>
                <header>
                    <Link to="/gamecorner/browser" style={{ color: hoverState[19].hovered ? "#92f" : "#cccccc" }} 
                        className={styles.goBack}
                        onMouseEnter={handleHover}
                        onMouseLeave={handleHover}
                    >
                        <Arrow style={{ fill: hoverState[19].hovered ? "#92f" : "#cccccc" }} className={styles.arrow} />
                        Store
                    </Link>
                    <h1>{currentGame ? currentGame.name : templateGame.name}</h1>
                </header>

                <section className={styles.game}>
                {/* <Slider 
                    selectedGame={currentGame}
                    setSelectedGame={setSelectedGame}
                    allGames={allGames}
                    incrementCarousel={incrementCarousel}
                    decrementCarousel={decrementCarousel}
                    carouselState={carouselState}
                    setCarouselState={setCarouselState}
                    hoverState={hoverState}
                    handleHover={handleHover}
                  /> */}
                  <GameContainer> { currentGame ? 
                   <GameComponent game={currentGame.link} /> 
                  : <Slider 
                  selectedGame={currentGame}
                  setSelectedGame={setSelectedGame}
                  allGames={allGames}
                  incrementCarousel={incrementCarousel}
                  decrementCarousel={decrementCarousel}
                  carouselState={carouselState}
                  setCarouselState={setCarouselState}
                  hoverState={hoverState}
                  handleHover={handleHover}
                    />
                  }</GameContainer>
                  {/* {currentGame.isSelected ? <div>{currentGame.link} </div> */}
                  {/* : <h3>false</h3>} */}
                  <div className={styles.gameInfo}>
                    <div className={styles.about}>
                      <div className={styles.aboutTop}>
                        <h2>About</h2>
                        <p>{currentGame ? currentGame.desc : templateGame.desc}</p>
                      </div>
                      <div 
                        className={extended ? `${styles.conditionalOpen} ${styles.aboutBottom}` : `${styles.conditionalClose} ${styles.aboutBottomClosed}`} 
                        id="about"
                      >
                        <AnimatedText>
                             <div className={textExtended ? styles.open : styles.closed}>
                                 <a href={currentGame ? currentGame.link : templateGame.link} target="_blank">{currentGame ? currentGame.name : "No"} Website</a>
                                 <h4>Released: {currentGame ? currentGame.release : templateGame.release}</h4>
                                 <h4>Platforms: {currentGame ? currentGame.platforms : templateGame.platforms}</h4>
                                 <h4>Main Genre: {currentGame ? currentGame.genre : templateGame.genre}</h4>
                                 <h4>Developers: {currentGame ? currentGame.developers : templateGame.developers}</h4>
                                 <h4 className={styles.lastChild}>Publishers: {currentGame ? currentGame.publishers : templateGame.publishers}</h4>
                             </div>
                        </AnimatedText>

                        <button 
                          id="20" 
                          onClick={handleExtend} 
                          onMouseEnter={handleHover} 
                          onMouseLeave={handleHover} 
                          className={hoverState[20].hovered ? styles.buttonHovered : styles.buttonNotHovered} 
                          aria-label="Extend"
                        >
                          {extended ? "Hide" : "More"}
                          {extended ? <Up  className={styles.up} style={{ fill: hoverState[20].hovered ? "#fff" : "#cccccc" }}/> : <Up className={styles.down} style={{ fill: hoverState[20].hovered ? "#fff" : "#cccccc" }}/>}
                        </button>
                      </div>
                    </div>

                    <div className={styles.addToCart}>
                      <div className={styles.infos}>
                          <h3>${currentGame ? currentGame.price : templateGame.price}</h3>
                          <button id={currentGame ? currentGame.id : templateGame.id} onClick={handleLike} aria-label="Like">
                              <Like 
                                className={currentGame ? currentGame.isLiked ? styles.liked : styles.like : styles.like}
                              />
                          </button>
                      </div>
                      {/* {selectedGame ? selectedGame.inCart ? <AddedToCartBig /> : 
                      <button 
                        id="21" 
                        onMouseEnter={handleHover} 
                        onMouseLeave={handleHover} 
                        className={styles.addToCartButton}
                        style={{ color: hoverState[21].hovered ? "#92f" : "#999999" }} 
                        onClick={handleAddToCart} 
                        aria-label="Add"
                      >
                        Add to cart
                        <Add 
                          className={styles.add} 
                          style={{ fill: hoverState[21].hovered ? "#92f" : "#999999" }}
                        />
                      </button> : 

                      <button 
                        id="21" 
                        onMouseEnter={handleHover} 
                        onMouseLeave={handleHover} 
                        style={{ color: hoverState[21].hovered ? "#D2042D" : "#999999" }} 
                        onClick={handleAddToCart} 
                        aria-label="Add"
                      >
                        Not available
                        <Add 
                          className={styles.add} 
                          style={{ fill: hoverState[21].hovered ? "#D2042D" : "#999999" }}
                        />
                      </button>} */}
                    </div>
                  </div>
                </section>
              </div>
            </AnimatedGamePage>
        </div>
    </>
  );
}

export default GamePage;