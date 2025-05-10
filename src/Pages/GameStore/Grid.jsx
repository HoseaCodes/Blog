import styles from './Grid.module.css';
import React, { useEffect } from 'react';
import Card from './Card';
import { Link } from "react-router-dom";

const Grid = props => {
    const {
        shownGames,
        reviewDisplay,
        handleLike,
        handleHoverGame,
        hoverState,
        grid,
        search,
        cartDisplayed,
        searching,
        handleSelectGame,
    } = props;

    useEffect(() => {
        if (grid === false) {
            if (document.getElementsByClassName('gridContainer')) {
                let grid = document.getElementById('gridContainer')
                grid.className = styles.noGrid
            }
        } else if (grid) {
            if (document.getElementById('gridContainer').className === styles.noGrid) {
                let grid = document.getElementById('gridContainer')
                grid.className = styles.gridContainer
            }
        }
    }, [grid])

    return (
    <>
          <div className={styles.reviews} style={{ display: reviewDisplay ? "flex" : "none" }}>
              <h2>There are no reviews yet!</h2>
              <h3>You can add some, soon.</h3>
          </div>
          <div className={styles.gridContainer} style={{ display: reviewDisplay ? "none" : "grid" }} id="gridContainer">
            {
                shownGames.map((game, i) => {
                    
                    // return <Link to={`/gamestore/game/${game.id}`}>
                        return        <Card 
                                    game={game} 
                                    key={game.name} 
                                    handleLike={handleLike} 
                                    handleHoverGame={handleHoverGame} 
                                    handleSelectGame={handleSelectGame}
                                    hoverState={hoverState}
                                    /> 
                            // </Link>
                })
            }
            {/* {searching === false ? cartDisplayed ? shownGames.map((game, i) => {
                if (i <= 7) {
                    return <Card 
                    game={game} 
                    key={game.name} 
                    handleLike={handleLike} 
                    handleHoverGame={handleHoverGame} 
                    handleSelectGame={handleSelectGame}
                    hoverState={hoverState}
                  />
                }
            }) : shownGames.map((game, i) => {
                return <Card 
                         game={game} 
                         key={game.name} 
                         handleLike={handleLike} 
                         handleHoverGame={handleHoverGame} 
                         handleSelectGame={handleSelectGame}
                         hoverState={hoverState}
                       />
            }) : shownGames.map((game, i) => {
                if (game.name.toLowerCase().includes(search.toLowerCase())) {
                    return <Card 
                             game={game} 
                             key={game.name} 
                             handleLike={handleLike} 
                             handleHoverGame={handleHoverGame} 
                             handleSelectGame={handleSelectGame}
                             hoverState={hoverState}
                           />
                }
            })} */}
          </div>
    </>
    );
  }
  
  export default Grid;