import React, { Component } from 'react';
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
import Client from './Pages/Client/Client';
import ArticleItem from './Pages/Articles/Article/Article';
import ProjectItem from './Pages/Projects/Project/Project';
import Login from './Pages/Auth/login';
import Register from './Pages/Auth/register';


export default class App extends Component {
  state = {
    user: null,
    authenticated: false
  }

  render() {

    return (

      <BrowserRouter>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Home
              />
            )}
          />
          <Route
            path="/about"
            exact
            render={() => (
              <About

              />
            )}
          />
          <Route
            path="/shop"
            exact
            render={() => (
              <Shop
              />
            )}
          />
          <Route path="/client" exact render={() => (
              <Client
              />
            )}
          />
          <Route path="/project" exact component={Projects}/>
          <Route path="/project/:id" exact component={ProjectItem}/>
          <DataProvider>
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            <Route path="/blog" exact component={Articles} />
            <Route path="/blog/:id" exact component={ArticleItem} />
            <Route path="/blog/new" exact component={CreateArticle} />
            <Route path="/blog/edit" exact component={CreateArticle} />
            <Route path="/contact" exact component={Contact} />
          </DataProvider>
          <Error />
        </Switch>
      </BrowserRouter>
    );
  }
}


