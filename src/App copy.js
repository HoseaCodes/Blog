import React, { Component, useEffect, useLocation, useState } from 'react';
import * as Sentry from "@sentry/react";
import Home from './Pages/Home/Home'
import Projects from './Pages/Projects/Projects'
import About from './Pages/About/About'
import Articles from './Pages/Articles/Articles'
import Contact from './Pages/Contact/Contact'
import Error from './Pages/Error/Error'
import Shop from './Pages/Shop/Shop';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CreateArticle from './Pages/Articles/CreateArticle'
import { DataProvider } from './GlobalState';
import ArticleItem from './Pages/Articles/Article/Article';
import ProjectItem from './Pages/Projects/Project/Project';
import Login from './Pages/Auth/login';
import Register from './Pages/Auth/register';
import Profile from './Pages/User/profile';
import Editprofile from './Pages/User/editProfile';
import NavBar from './Components/NavBar/NavBar';
import Footer from './Components/Footer/Footer';
import { createBrowserHistory } from 'history';
import Tools from './Pages/Tools';
import Games from './Pages/Games';
import GameHome from './Pages/GameStore/GameHome';
import { AnimatePresence } from "framer-motion";
import ProvideAuth from './Utils/provideauth';
import PrivateRoute from './Utils/privateroute';
import Test from './Pages/Test';
// class App extends Component {

const App = () => {

  // render() {
    const location = useLocation();
    const [browsing, setBrowsing] = useState(true);
    const [overlap, setOverlap] = useState(false);

    useEffect(() => {
      setOverlap(false);
    
      if (location.pathname === "/gamestore/") {
        setBrowsing(false);
      } else {
        setBrowsing(true);
      }
    
      if (location.pathname != "/gamestore/browse") {
        document.body.style.overflow = "hidden";
    
      } else if (location.pathname === "/gamestore/browse") {
        document.body.style.overflow = "scroll";
      }
    }, [location.pathname])
    const history = createBrowserHistory();
    return (
      <BrowserRouter history={history}>
        <Switch key={location.pathname} location={location}>
          <DataProvider>
            <NavBar/>
            <AnimatePresence exitBeforeEnter>
              <ProvideAuth>
                <Route exact path="/" render={() => (<Home/>)}/>
                <Route path="/about" exact render={() => ( <About/>)}/>
                <Route path="/tools" exact render={() => ( <Tools/>)}/>
                <Route path="/onlinegaming" exact render={() => ( <Games/>)}/>
                <Route path="/shop" exact render={() => (<Shop/>)}/>
                <Route path="/gamecorner" exact component={GameHome}/>
                <Route path="/profile" exact component={Profile}/>
                <Route path="/edit" exact component={Editprofile}/>
                <Route path="/project" exact component={Projects}/>
                <Route path="/project/:id" exact component={ProjectItem}/>
                <Route path="/login" exact component={Login} />
                <Route path="/register" exact component={Register} />
                <Route path="/blog" exact component={Articles} />
                <Route path="/blog/:id" exact component={ArticleItem} />
                <Route path="/blog/new" exact component={CreateArticle} />
                <Route path="/blog/edit" exact component={CreateArticle} />
                <Route path="/contact" exact component={Contact} />
                <Route path="*" component={Error} />
                {/* <PrivateRoute path="/protected">
                  <Test />
                </PrivateRoute> */}
              </ProvideAuth>
            </AnimatePresence>

            <Footer/>
          </DataProvider>
        </Switch>
      </BrowserRouter>
    );
  // }
}


export default Sentry.withProfiler(App);
