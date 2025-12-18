import React, { lazy, Suspense, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import Home from "./Pages/Home/Home";
import Projects from "./Pages/Projects/Projects";
import Articles from "./Pages/Articles/Articles";
import Error from "./Pages/Error/Error";
import Shop from "./Pages/Shop/Shop";
import { BrowserRouter, Switch, Route, useLocation } from "react-router-dom";
import CreateArticle from "./Pages/Articles/CreateArticle";
import { DataProvider } from "./GlobalState";
import { GameScoreProvider } from "./Context/GameScoreContext";
import ArticleItem from "./Pages/Articles/Article/Article";
import ProjectItem from "./Pages/Projects/Project/Project";
import Login from "./Pages/Auth/login";
import Register from "./Pages/Auth/register";
import ForgotPassword from "./Pages/Auth/forgotPassword";
import ResetPassword from "./Pages/Auth/resetPassword";
import CheckStatus from "./Pages/Auth/checkStatus";
import ProLoader from "./Components/Loading/ProLoader";
import Editprofile from "./Pages/User/editProfile";
import { createBrowserHistory } from "history";
import Profile from "./Pages/User/profile";
import Layout from "./Layout/Layout";
import Loading from "./Loading";
import Products from "./Pages/Products/Products";
import CreateProduct from "./Components/Product/CreateProduct";
import DetailProduct from "./Components/Product/DetailProduct";
import OrderDetails from "./Components/Order/OrderDetials";
import Checkout from "./Pages/Checkout/Checkout";
import UsersList from "./Components/User/ListUser";
import History from "./Pages/Order/History";
import UploadList from "./Components/User/UploadList";
import PrivateRoute from "./PrivateRouter";
import Tools from "./Pages/Tools";
import Games from "./Pages/Games";
import GameHome from "./Pages/GameStore/GameHome";
import Game from "./Pages/GameStore/Game";
import { AnimatePresence } from "framer-motion";
import games from "./Constants/games";
import filterNames from "./Constants/filterNames";
import Browser from "./Pages/GameStore/Browser";
import ReactGA from 'react-ga4';

const About = lazy(() => import("./Pages/About/About"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));

const App = () => {
  const history = createBrowserHistory();
  if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_GOOGLE_MEASUREMENT_ID) {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_MEASUREMENT_ID);
    history.listen((location, action) => {
      ReactGA.send({
        hitType: "pageview",
        page: location.pathname,
        title: location.search,
      });
    });
    useEffect(() => {
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
        title: window.location.search,
      });
    }, []);

  }

  const [currentFilter, setCurrentFilter] = useState("none");
  const [allGames, setAllGames] = useState(games);
  const [cart, setCart] = useState([]);
  const [cartAmount, setCartAmount] = useState(0);
  const [shownGames, setShownGames] = useState(allGames);
  const [reviewDisplay, setReviewDisplay] = useState(false);
  const [cartDisplayed, setCartDisplayed] = useState(false);
  const [search, setSearch] = useState("");
  const [overlap, setOverlap] = useState(false);
  const [searching, setSearching] = useState(false);
  const [browsing, setBrowsing] = useState(true);
  const [selectedGame, setSelectedGame] = useState(false);
  const [extended, setExtended] = useState(false);
  const [textExtended, setTextExtended] = useState(false);
  const [hoverState, setHoverState] = useState([
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
  // render() {
  // const navigate = useNavigate();
  // const location = useLocation();
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setSearching(false);
  };

  const handleSearchSubmit = (e) => {
    setCurrentFilter("none");
    e.preventDefault();
    setSearching(true);

    // if (location.pathname != "/react-ecommerce-store/browse") {
    //   // navigate('/react-ecommerce-store/browse');
    // }
  };

  const handleSelect = (e) => {
    setCurrentFilter(filterNames[e.target.id - 8]);
    console.log(filterNames[e.target.id - 8]);
    console.log(currentFilter);
  };

  const handleSelectGame = (e) => {
    if (e.target.tagName === "BUTTON") {
      return;
    } else if (e.target.classList[0] != "AddToCart_addToCart__zbJPe") {
      setSelectedGame(games[e.currentTarget.id]);
      window.location.href = `/gamecorner/game/${e.currentTarget.id}`;
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

  const clearFilter = () => {
    setCurrentFilter("none");
    setSearch("");
    setReviewDisplay(false);
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
        <GameScoreProvider>
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
            <PrivateRoute
              type={"admin"}
              path="/admin/blog/new"
              exact={true}
              element={CreateArticle}
            />
            <PrivateRoute
              type={"admin"}
              path="/admin/blog/edit/:id"
              exact={true}
              element={CreateArticle}
            />
            {/* Blog */}
            {/* Authentication */}
            <Route path="/login" exact={true} component={Login} />
            <Route path="/register" exact={true} component={Register} />
            <Route path="/forgot-password" exact={true} component={ForgotPassword} />
            <Route path="/reset-password" exact={true} component={ResetPassword} />
            <Route path="/check-status" exact={true} component={CheckStatus} />
            {/* Authentication */}
            {/* Showcase */}
            <Route path="/project" exact={true} component={Projects} />
            <Route path="/project/:id" exact={true} component={ProjectItem} />
            {/* Showcase */}
            {/* UserManagement */}
            <PrivateRoute
              type={"login"}
              path="/profile"
              exact={true}
              element={Profile}
            >
              <Profile />
            </PrivateRoute>
            {/* <PrivateRoute type={"login"} path="/profile" exact={true} element={Profile} /> */}
            <PrivateRoute
              type={"login"}
              path="/profile/edit"
              exact={true}
              element={Editprofile}
            />
            {/* UserManagement */}
            {/* AdminManagement */}
            <PrivateRoute
              type={"admin"}
              path="/admin/users"
              exact={true}
              element={UsersList}
            />
            <PrivateRoute
              type={"admin"}
              path="/admin/uploads"
              exact={true}
              element={UploadList}
            />
            {/* AdminManagement */}
            {/* Shop */}
            <PrivateRoute
              type={"login"}
              path="/shop"
              exact={true}
              element={Shop}
            />
            <PrivateRoute
              type={"login"}
              path="/shop/products"
              exact={true}
              element={Products}
            />
            <PrivateRoute
              type={"login"}
              path="/shop/products/detail/:id"
              exact={true}
              element={DetailProduct}
            />
            <PrivateRoute
              type={"admin"}
              path="/admin/shop/create_product"
              exact={true}
              element={CreateProduct}
            />
            <PrivateRoute
              type={"admin"}
              path="/admin/shop/edit_product/:id"
              exact={true}
              element={CreateProduct}
            />
            <PrivateRoute
              type={"login"}
              path="/shop/products/history"
              exact={true}
              element={History}
            />
            <PrivateRoute
              type={"login"}
              path="/shop/products/history/:id"
              exact={true}
              element={OrderDetails}
            />
            <PrivateRoute
              type={"login"}
              path="/shop/cart"
              exact={true}
              element={Checkout}
            />
            {/* Shop */}
            {/* GameStore */}
            <Route path="/tools" exact render={() => ( <Tools/>)}/>
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
            {/* GameStore */}
            {/* 404 */}
            {/* <Route component={Error} /> */}
            {/* 404 */}
          </Layout>
        </DataProvider>
        </GameScoreProvider>
      </Switch>
    </BrowserRouter>
  );
};

export default Sentry.withProfiler(App);
