import React, { useState } from "react";
import styles from "./Home.module.css";
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
// import { ReactComponent as WhatRuns } from "./image/whatruns.png";
import WhatRuns from "./image/whatruns.png";
import { motion, AnimatePresence, m } from "framer-motion";
import { Link, useHistory } from "react-router-dom";
import Cart from "../../Components/Cart/Cart";
import AnimatedScroll from "./AnimatedScroll";
import games from "./games";
// import gameOverlay from "../../Assets/Videos/pyke.mp4";
// import scarySound from "../../Assets/Sounds/garden-vocal-experimental-26509.mp3";
import AutoplayAudio from "./AutoplayAudio";

const GameHome = (props) => {
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
    openGamePage,
  } = props;

  const [browsing, setBrowsing] = useState(false);
  const [landingPage, setLandingPage] = useState(true);

  // const navigate = useNavigate();
  const history = useHistory();

  const handleHover = (e) => {
    let newHoverState = hoverState[e.target.id];
    newHoverState.hovered = !newHoverState.hovered;

    setHoverState([...hoverState, (hoverState[e.target.id] = newHoverState)]);
  };

  const handleBrowse = () => {
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      history.push("/gamecorner/browse");
    }, 1500);
  };

  const handleHome = () => {
    setBrowsing(false);
    history.push("/");
  };

  const handlePlayDice = () => {
    // let randomIndex = Math.floor(Math.random() * 32);
    let randomIndex = Math.floor(Math.random() * 11);
    let randomSurname = games[randomIndex].surname;
    console.log(randomSurname);
    setOverlap(true);
    setTimeout(() => {
      setBrowsing(true);
      history.push(`/gamecorner/game/${randomIndex}`);
    }, 1500);
  };

  const variants = {
    hidden: { opacity: 1, x: -150 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 150 },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 900 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { y: { type: "tween", duration: 1.5, bounce: 0.3 } },
    },
  };

  return (
    <div className={styles.main}>
      {overlap ? (
        <motion.div
          className={styles.overlap}
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
        ></motion.div>
      ) : null}

      {!cartDisplayed ? null : (
        <Cart
          cartDisplayed={cartDisplayed}
          handleOpenCart={handleOpenCart}
          handleCloseCart={handleCloseCart}
          cart={cart}
          cartAmount={cartAmount}
          handleHover={handleHover}
          hoverState={hoverState}
          clearCart={clearCart}
          handleRemoveFromCart={handleRemoveFromCart}
          openGamePage={openGamePage}
        />
      )}
      <div className={styles.home}>
        <video autoPlay muted loop className={styles.video}>
          <source src="https://i.imgur.com/MiKpHQ4.mp4" type="video/mp4" />
        </video>
        {/* <AutoplayAudio src={scarySound} /> */}
        <div className={styles.container}>
          <div className={styles.left}>
            <div className={styles.splash}>
              <h1>Game Corner</h1>
              <p className={styles.intro}>
                Welcome to Dom's game corner, the best destination to play react
                online games. I have classic games, responsive support, and a
                flawless UX. Wish for more? Tell me {""}
                <span className={styles.careers}>below</span>
              </p>
            </div>

            <div className={styles.buttons}>
              <Link
                to="/gamecorner/browser"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <Enter className={styles.ctaSVG} />
                Browse
              </Link>
              <button
                className={styles.cta}
                onClick={handlePlayDice}
                aria-label="Open random game page"
              >
                <Dice className={styles.ctaSVG} />
                Random Game
              </button>
              <a href="https://github.com/HoseaCodes" target="_blank">
                <button className={styles.cta} aria-label="View Repository">
                  <GitHubLogo className={styles.ctaSVG} />
                  GitHub
                </button>
              </a>
              <a
                href="https://www.linkedin.com/in/dominique-hosea"
                target="_blank"
              >
                <button
                  className={`${styles.cta} ${styles.lastChild}`}
                  aria-label="Open LinkedIn"
                >
                  <LinkedIn className={`${styles.ctaSVG} ${styles.linkedin}`} />
                  <span>LinkedIn</span>
                </button>
              </a>
            </div>
          </div>

          <div className={styles.right}>
            <div className={styles.buttonsRight}>
              <h2>Quick Navigation</h2>
              <Link
                to="/gamecorner/game/11"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <Game className={styles.ctaSVG} />
                Game Page
              </Link>

              <Link
                to="/gamecorner/this-page"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <NotFound className={styles.ctaSVG} />
                404 Page
              </Link>

              <Link
                to="/gamecorner/game/404"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <NotFoundQuery className={styles.ctaSVG} />
                404 Query
              </Link>

              <Link
                target="_blank"
                to="https://github.com/HoseaCodes/Blog/commits/main"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <Git className={styles.ctaSVG} />
                Commit Log
              </Link>

              <Link
                target="_blank"
                to="https://github.com/HoseaCodes/Blog/blob/main/README.md#performance"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <Performance className={styles.ctaSVG} />
                Performance
              </Link>

              <Link
                to="https://github.com/HoseaCodes/Blog/blob/main/README.md#technologies-used"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <img src={WhatRuns} alt="WhatRuns" className={styles.ctaSVG} />
                Technologies
              </Link>

              <Link
                target="_blank"
                to="https://github.com/HoseaCodes/Blog/blob/main/README.md#sources"
                className={`${styles.cta} ${styles.browseBtn}`}
              >
                <Sources className={styles.ctaSVG} />
                Our Sources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHome;
