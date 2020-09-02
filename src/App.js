import React from 'react';
import './App.css';
import Home from './Pages/Home/Home'
import Projects from './Pages/Projects/Projects'
import About from './Pages/About/About'
import Articles from './Pages/Articles/Articles'
import Contact from './Pages/Contact/Contact'
import Error from './Pages/Error/Error'
import { BrowserRouter, Switch, Route } from 'react-router-dom';




class App extends React.Component {
  constructor() {
    super();
    this.state = {

    };
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
          <Route
            exact
            path="/projects"
            render={() => (
              <Projects
              />
            )}
          />
          <Route
            exact
            path="/articles"
            render={() => (
              <Articles
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
            path="/contact"
            render={() => (
              <Contact

              />
            )}
          />

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

export default App;
