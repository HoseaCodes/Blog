import React, { Component } from 'react';
import './App.css';
import Home from './Pages/Home/Home'
import Projects from './Pages/Projects/Projects'
import About from './Pages/About/About'
import Articles from './Pages/Articles/Articles'
import Contact from './Pages/Contact/Contact'
import Error from './Pages/Error/Error'
import Shop from './Pages/Shop/Shop';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import CalorieKitchen from './Pages/Projects/CalorieKitchen';
// import CareerConnect from './Pages/Projects/CareerConnect';
// import MergeImmersive from './Pages/Projects/MergeImmersive';
// import DevCenter from './Pages/Projects/DevCenter';
import Stacks from './Pages/Articles/Stack';
import Bash from './Pages/Articles/Bash';
import BigO from './Pages/Articles/Big0';
import ReactSecurity from './Pages/Articles/ReactSecurity';
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
            exact
            path="/"
            render={() => (
              <Home
              />
            )}
          />
          {/* <Route
            exact
            path="/caloriekitchen"
            render={() => (
              <CalorieKitchen
              />
            )}
          />
          <Route
            exact
            path="/devcenter"
            render={() => (
              <DevCenter
              />
            )}
          />
          <Route
            exact
            path="/careerconnect"
            render={() => (
              <CareerConnect
              />
            )}
          />
          <Route
            exact
            path="/mergeimmersive"
            render={() => (
              <MergeImmersive
              />
            )}
          /> */}
          <Route
            exact
            path="/bash"
            render={() => (
              <Bash
              />
            )}
          />
          <Route
            exact
            path="/bigo"
            render={() => (
              <BigO
              />
            )}
          />
          <Route
            exact
            path="/reactsecurity"
            render={() => (
              <ReactSecurity
              />
            )}
          />
          <Route
            exact
            path="/stack"
            render={() => (
              <Stacks
              />
            )}
          />
          <Route
            path="/about"
            render={() => (
              <About

              />
            )}
          />
          <Route
            path="/shop"
            render={() => (
              <Shop
              />
            )}
          />
          <Route path="/client" render={() => (
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
        {/* // <div className="App">
      //   <Route exact path="/" component={Projects} />
      //   <Route exact path="/articles" component={Articles} />
      //   <Route exact path="/about" component={About} />
      //   <h1>App JS</h1>

      //   <Home />
      // </div> */}
      </BrowserRouter>
    );
  }
}

