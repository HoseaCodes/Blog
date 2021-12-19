import React, { Component } from 'react';
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

class App extends Component {


  render() {
    const history = createBrowserHistory();
    return (
      <BrowserRouter history={history}>
        <Switch>
          <DataProvider>
            <NavBar/>
            <Route exact path="/" render={() => (<Home/>)}/>
            <Route path="/about" exact render={() => ( <About/>)}/>
            <Route path="/shop" exact render={() => (<Shop/>)}/>
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
            <Footer/>
          </DataProvider>
            <Route path="*" component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}


export default Sentry.withProfiler(App);
