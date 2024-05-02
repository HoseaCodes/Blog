import React, { useState } from 'react';
import styles from './Home.module.css';
import { ReactComponent as GitHubLogo } from "./image/githublogo.svg";
import { ReactComponent as Enter } from "./image/enter.svg";
import { ReactComponent as Dice } from "./image/dice.svg";
import { ReactComponent as LinkedIn } from "./image/linkedin.svg";
import { ReactComponent as Game } from "./image/game.svg";
import { ReactComponent as NotFound } from "./image/notfound.svg";
import { ReactComponent as NotFoundQuery } from "./image/notfoundquery.svg";
import { ReactComponent as Git } from "./image/git.svg";
import { ReactComponent as Performance } from "./image/performance.svg";
import { ReactComponent as Sources } from "./image/sources.svg";
import WhatRuns from "./image/whatruns.png";
import { motion, AnimatePresence, m } from "framer-motion";
import { Link, useHistory } from 'react-router-dom';
// import Cart from '../../Components/Cart/Cart';
import AnimatedScroll from './AnimatedScroll';
import games from './games';
import gameOverlay from "../../Assets/Videos/pyke.mp4"

const GameHome = props => {
  const {
    shownGames,
    cartAmount,
    cart,
    cartDisplayed,
    handleOpenCart,
    handleCloseCart,
    clearCart,
    handleRemoveFromCart,
    hoverState,
    setHoverState,
    overlap,
    setOverlap,
    openGamePage
  } = props;

  const [browsing, setBrowsing] = useState(false);
  const [landingPage, setLandingPage] = useState(true);

  // const navigate = useNavigate();
  const history = useHistory();

  const handleHover = (e) => {
    let newHoverState = hoverState[e.target.id];
    newHoverState.hovered = !newHoverState.hovered;

    setHoverState([
        ...hoverState, hoverState[e.target.id] = newHoverState
    ]);
  }

  const handleBrowse = () => {
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      history.push('/gamecorner/browse');
    }, 1500);
  }

  const handleHome = () => {
    setBrowsing(false);
    history.push('/');
  }

  const handleNavGamePage = () => {
    setHoverState([...hoverState, hoverState[21].hovered = false]);
    history.push('/gamecorner/game/11');
  }
  
  const handleNavNotFoundPage = () => {
    history.push('/gamecorner/this-page');
  }
  
  const handleNavNotFoundQuery = () => {
    history.push('/gamecorner/game/404');
  }
  
  const handlePlayDice = () => {
    // let randomIndex = Math.floor(Math.random() * 32);
    let randomIndex = Math.floor(Math.random() * 11);
    let randomSurname = games[randomIndex].surname;
    console.log(randomSurname)
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      history.push(`/gamecorner/game/${randomIndex}`);
    }, 1500);
  }

  const variants = {
    hidden: { opacity: 1, x: -150 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 150 },
  }

  const buttonVariants = {
    hidden: { opacity: 0, y: 900 },
    visible: { opacity: 1, y: 0, transition: {  y: { type: "tween", duration: 1.5, bounce: 0.3 }} },
  }

  return (
    <div className={styles.main}>
      {overlap ? 
          <motion.div 
            className={styles.overlap}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
          >
    
          </motion.div> 
      : null}

      {cartDisplayed ? null
    //   <Cart 
    //           cartDisplayed={cartDisplayed} 
    //           handleOpenCart={handleOpenCart}
    //           handleCloseCart={handleCloseCart}
    //           cart={cart}
    //           cartAmount={cartAmount}
    //           handleHover={handleHover}
    //           hoverState={hoverState}
    //           clearCart={clearCart}
    //           handleRemoveFromCart={handleRemoveFromCart}
    //           openGamePage={openGamePage}
    //   />
       : null}
        <div className={styles.home}>

                <video autoPlay muted loop className={styles.video}>
                  <source src={gameOverlay} type="video/mp4" />
                </video>
                <div className={styles.container}>
                    <div className={styles.left}>
                        <div className={styles.splash}>
                          <h1>Game Corner</h1>
                          <p className={styles.intro}>
                            Welcome to Dom's game corner, the best destination to play react online games. 
                            We have classic games, responsive support, and a flawless UX. Wish for more? Tell us
                            <span className={styles.here}>below</span> — or check out our <span className={styles.careers}>careers.</span></p>
                        </div>
    
                        <div className={styles.buttons}>
                              <Link to="/gamecorner/browser" className={`${styles.cta} ${styles.browseBtn}`}>
                                <Enter className={styles.ctaSVG} />
                                Browse
                              </Link>
                              <button className={styles.cta} onClick={handlePlayDice} aria-label="Open random game page">
                                <Dice className={styles.ctaSVG} />
                                Random Game
                              </button>
                              <a href="https://github.com/HoseaCodes" target="_blank"><button className={styles.cta} aria-label="View Repository">
                                <GitHubLogo className={styles.ctaSVG} />
                                GitHub
                              </button></a>
                              <a href="https://www.linkedin.com/in/dominique-hosea" target="_blank"><button className={`${styles.cta} ${styles.lastChild}`} aria-label="Open LinkedIn">
                                <LinkedIn className={`${styles.ctaSVG} ${styles.linkedin}`} />
                                <span>LinkedIn</span>
                              </button></a>
                        </div>
                    </div>
    
                    <div className={styles.right}>
                        <div className={styles.buttonsRight}>
                            <h2>Quick Navigation</h2>
                            <button className={styles.cta} onClick={handleNavGamePage} aria-label="Open a game page">
                              <Game className={styles.ctaSVG} />
                              Game Page
                            </button>
                            <button className={styles.cta} onClick={handleNavNotFoundPage} aria-label="Open 404 page">
                              <NotFound className={styles.ctaSVG} />
                              404 Page
                            </button>
                            <button className={`${styles.cta} ${styles.lastChild}`} onClick={handleNavNotFoundQuery} aria-label="open 404 query page">
                              <NotFoundQuery className={`${styles.ctaSVG}`} />
                              404 Query
                            </button>
                            <a href='https://github.com/HoseaCodes/Blog/commits/main' target="_blank"><button className={styles.cta} aria-label="Open commit log">
                              <Git className={styles.ctaSVG} />
                              Commit Log
                            </button></a>
                            <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#performance" target="_blank"><button className={`${styles.cta} ${styles.lastChild}`} aria-label="Open performance test results">
                              <Performance className={`${styles.ctaSVG}`} />
                              Performance
                            </button></a>
                            <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#technologies-used" target="_blank"><button className={`${styles.cta} ${styles.lastChild}`} aria-label="View technologies used"> 
                              <img className={styles.technologies} src={WhatRuns} alt="WhatRuns logo"/>
                              Technologies
                            </button></a>
                            <a href="https://github.com/HoseaCodes/Blog/blob/main/README.md#sources" target="_blank"><button className={`${styles.cta} ${styles.lastChild}`} aria-label="View Sources">
                              <Sources className={`${styles.ctaSVG}`} />
                              Our Sources
                            </button></a>
                        </div>
                    </div>
                </div>
        </div>
    </div>
  );
}

export default GameHome;