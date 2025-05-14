import React, { lazy, Suspense } from 'react';
import * as Sentry from "@sentry/react";
import Home from './Pages/Home/Home'
import Projects from './Pages/Projects/Projects'
import Articles from './Pages/Articles/Articles'
import Error from './Pages/Error/Error'
import Shop from './Pages/Shop/Shop';
import { BrowserRouter, Switch, Route } from "react-router-dom";
import CreateArticle from './Pages/Articles/CreateArticle'
import { DataProvider } from './GlobalState';
import ArticleItem from './Pages/Articles/Article/Article';
import ProjectItem from './Pages/Projects/Project/Project';
import Login from './Pages/Auth/login';
import Register from './Pages/Auth/register';
import ProLoader from './Components/Loading/ProLoader';
import Editprofile from './Pages/User/editProfile';
import { createBrowserHistory } from 'history';
import Profile from './Pages/User/profile';
import Layout from './Layout/Layout';
import Loading from './Loading';
import Products from './Pages/Products/Products';
import CreateProduct from './Components/Product/CreateProduct';
import DetailProduct from './Components/Product/DetailProduct';
import OrderDetails from './Components/Order/OrderDetials';
import Checkout from './Pages/Checkout/Checkout';
import UsersList from './Components/User/ListUser';
import History from './Pages/Order/History';
import UploadList from './Components/User/UploadList';
import PrivateRoute from './PrivateRouter';
import Games from "./Pages/Games";
import GameHome from "./Pages/GameStore/GameHome";
import Game from "./Pages/GameStore/Game";
import games from "./Constants/games";
import Browser from "./Pages/GameStore/Browser";
import GameCenterWrapper from './Components/GameCenterWrapper';

const About = lazy(() => import("./Pages/About/About"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));


const App = () => {
  const [currentFilter, setCurrentFilter] = React.useState("none");
  const [allGames, setAllGames] = React.useState(games);
  const [shownGames, setShownGames] = React.useState(allGames);
  const [selectedGame, setSelectedGame] = React.useState(false);
  const [cartDisplayed, setCartDisplayed] = React.useState(false);
  const [overlap, setOverlap] = React.useState(false);
  const [extended, setExtended] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [reviewDisplay, setReviewDisplay] = React.useState(false);
  const [hoverState, setHoverState] = React.useState([
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
    {
      hovered: false,
      selected: false,
    },
  ]);
  const history = createBrowserHistory();

  const handleSelect = (e) => {
    setCurrentFilter(filterNames[e.target.id - 8]);
    console.log(filterNames[e.target.id - 8]);
    console.log(currentFilter);
  };
  
  const clearFilter = () => {
    setCurrentFilter("none");
    setSearch("");
    setReviewDisplay(false);
  };

  const handleSelectGame = (e) => {
    if (e.target.tagName === "BUTTON") {
      return;
    } else if (e.target.classList[0] != "AddToCart_addToCart__zbJPe") {
      setSelectedGame(games[e.target.parentNode.id]);
      window.location.href = `/gamecorner/game/${e.target.parentNode.id}`;
      console.log(e);
    }
  };

  const handleHome = () => {
    window.location.href = "/gamecorner";
  };

  const handleLike = (e) => {
    let handledLike = allGames.map((game, i) => {
      if (e.target.parentNode.id == i) {
        game.isLiked = !game.isLiked;
        return game;
      } else {
        return game;
      }
    });

    setAllGames(handledLike);
  };

  const openGamePage = (e) => {
    setCartDisplayed(false);
    let selectedGameSurname = e.target.id;
    // navigate(`/react-ecommerce-store/games/${selectedGameSurname}`);
  };

  const handleHover = (e) => {
    if (hoverState[e.target.id].selected) {
      return;
    }

    let newHoverState = hoverState.map((element, i) => {
      if (e.target.id == i) {
        element.hovered = !element.hovered;
        return element;
      } else {
        return element;
      }
    });

    setHoverState(newHoverState);
  };

  const handleHoverGame = (e) => {
    let handledHoveredGame = allGames.map((game, i) => {
      if (e.target.id == i) {
        game.isHovered = !game.isHovered;
        return game;
      } else {
        return game;
      }
    });

    setAllGames(handledHoveredGame);
  };

    return (
      <BrowserRouter history={history}>
        <Switch>
          <DataProvider>
            <Layout>
              <Route exact={true} path="/" render={() => <Home />} />
              <Suspense fallback={<ProLoader />}>
                {/* Static */}
                <Route path="/about" exact={true} component={About} />
                <Route path="/contact" exact={true} component={Contact} />
                {/* Static */}
              </Suspense>
              {/* Blog */}
              <Route path="/blog" exact={true} component={Articles} />
              <Route path="/blog/:id" exact={true} component={ArticleItem} />
              <PrivateRoute type={"admin"} path="/admin/blog/new" exact={true} element={CreateArticle} />
              <PrivateRoute type={"admin"} path="/admin/blog/edit/:id" exact={true} element={CreateArticle} />
              {/* Blog */}
              {/* Authentication */}
              <Route path="/login" exact={true} component={Login} />
              <Route path="/register" exact={true} component={Register} />
              {/* Authentication */}
              {/* Showcase */}
              <Route path="/project" exact={true} component={Projects} />
              <Route path="/project/:id" exact={true} component={ProjectItem} />
              {/* Showcase */}
              <Route path="/games/*" element={<GameCenterWrapper />} />
              {/* UserManagement */}
              <PrivateRoute type={"login"} path="/profile" exact={true} element={Profile} >
                <Profile />
              </PrivateRoute>
              {/* <PrivateRoute type={"login"} path="/profile" exact={true} element={Profile} /> */}
              <PrivateRoute type={"login"} path="/profile/edit" exact={true} element={Editprofile} />
              {/* UserManagement */}
              {/* AdminManagement */}
              <PrivateRoute type={"admin"} path="/admin/users" exact={true} element={UsersList} />
              <PrivateRoute type={"admin"} path="/admin/uploads" exact={true} element={UploadList} />
              {/* AdminManagement */}
              {/* Shop */}
              <PrivateRoute type={"login"} path="/shop" exact={true} element={Shop}/>
              <PrivateRoute type={"login"} path="/shop/products" exact={true} element={Products} />
              <PrivateRoute type={"login"} path="/shop/products/detail/:id" exact={true} element={DetailProduct} />
              <PrivateRoute type={"admin"} path="/admin/shop/create_product" exact={true} element={CreateProduct} />
              <PrivateRoute type={"admin"} path="/admin/shop/edit_product/:id" exact={true} element={CreateProduct} />
              <PrivateRoute type={"login"} path="/shop/products/history" exact={true} element={History} />
              <PrivateRoute type={"login"} path="/shop/products/history/:id" exact={true} element={OrderDetails} />
              <PrivateRoute type={"login"} path="/shop/cart" exact={true} element={Checkout} />
              {/* Shop */}
              {/* Games */}
              {/* <Route path="/onlinegaming" exact render={() => ( <Games/>)}/> */}
              <PrivateRoute
                type={"login"}
                path="/gamecorner"
                exact={true}
                isGame={true}
                Game={
                  <GameHome
                    cartDisplayed={cartDisplayed}
                    handleHover={handleHover}
                    hoverState={hoverState}
                    shownGames={shownGames}
                    handleLike={handleLike}
                    handleHoverGame={handleHoverGame}
                    handleSelectGame={handleSelectGame}
                    setHoverState={setHoverState}
                    overlap={overlap}
                    setExtended={setExtended}
                    setOverlap={setOverlap}
                    openGamePage={openGamePage}
                  />
                }
              />
              <PrivateRoute
                type={"login"}
                path="/gamecorner/game/:id"
                exact={true}
                isGame={true}
                Game={
                  <Game
                    handleHover={handleHover}
                    hoverState={hoverState}
                    shownGames={shownGames}
                    handleLike={handleLike}
                    handleHoverGame={handleHoverGame}
                    handleSelectGame={handleSelectGame}
                    setHoverState={setHoverState}
                    overlap={overlap}
                    setOverlap={setOverlap}
                    openGamePage={openGamePage}
                    setExtended={setExtended}
                  />
                }
              />
              <PrivateRoute
                type={"login"}
                path="/gamecorner/browser"
                exact={true}
                isGame={true}
                Game={
                  <Browser
                    handleHover={handleHover}
                    hoverState={hoverState}
                    shownGames={shownGames}
                    allGames={allGames}
                    currentFilter={currentFilter}
                    clearFilter={clearFilter}
                    setShownGames={setShownGames}
                    setReviewDisplay={setReviewDisplay}
                    handleLike={handleLike}
                    handleHome={handleHome}
                    handleSelect={handleSelect}
                    handleHoverGame={handleHoverGame}
                    handleSelectGame={handleSelectGame}
                    setHoverState={setHoverState}
                    overlap={overlap}
                    setOverlap={setOverlap}
                    setExtended={setExtended}
                    openGamePage={openGamePage}
                  />
                }
              />
              {/* Games */}
              {/* 404 */}
              {/* <Route component={Error} /> */}
              {/* 404 */}
            </Layout>
          </DataProvider>
        </Switch>
      </BrowserRouter>
    );
}


export default Sentry.withProfiler(App);
