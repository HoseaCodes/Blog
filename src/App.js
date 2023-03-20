// import React, { Component, lazy, Suspense, useContext} from 'react';
import React, { lazy, Suspense, useContext} from 'react';
import * as Sentry from "@sentry/react";
import Home from './Pages/Home/Home'
import Projects from './Pages/Projects/Projects'
import Articles from './Pages/Articles/Articles'
import Error from './Pages/Error/Error'
// import Shop from './Pages/Shop/Shop';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import CreateArticle from './Pages/Articles/CreateArticle'
import { DataProvider } from './GlobalState';
import ArticleItem from './Pages/Articles/Article/Article';
import ProjectItem from './Pages/Projects/Project/Project';
import Login from './Pages/Auth/login';
import Register from './Pages/Auth/register';
import ProLoader from './Components/Loading/ProLoader';
// import Profile from './Pages/User/profile';
// import Editprofile from './Pages/User/editProfile';
import { createBrowserHistory } from 'history';
// import Loading from './Loading';
// import Products from './Pages/Products/Products';
// import CreateProduct from './Components/Product/CreateProduct';
// import DetailProduct from './Components/Product/DetailProduct';
// import OrderDetails from './Components/Order/OrderDetials';
// import Checkout from './Pages/Checkout/Checkout';
// import UsersList from './Components/User/ListUser';
// import History from './Pages/Order/History';
// import UploadList from './Components/User/UploadList';
// import PrivateRoute from './PrivateRoute';
const About = lazy(() => import("./Pages/About/About"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));

// class App extends Component {


  // render() {
const App = (props) => {

    const history = createBrowserHistory();

    const isLoggedIn = false
    console.log(props, 'state')
    // const isAdmin = false
    // const [isAdmin] = state.userAPI.isAdmin

    return (
      <BrowserRouter history={history}>
        <Switch>
          <DataProvider>
            {/* <NavBar/> */}
            <Route exact path="/" render={() => (<Home />)}/>
            <Suspense fallback={<ProLoader/>}>
              <Route path="/about" exact component={About}/>
              <Route path="/contact" exact component={Contact} />
            </Suspense>

            {/* User */}
            {/* <PrivateRoute path="/profile"  component={Profile}/> */}
            {/* <Route path="/profile" exact component={Profile}/> */}
            {/* <Route path="/edit" exact component={Editprofile}/> */}
            {/* User */}

            {/* Showcase */}
            <Route path="/project" exact component={Projects}/>
            <Route path="/project/:id" exact component={ProjectItem}/>
            {/* Showcase */}

            {/* Authentication */}
            <Route path="/login" exact component={Login} />
            <Route path="/register" exact component={Register} />
            {/* Authentication */}

            {/* Blog */}
            <Route path="/blog" exact component={Articles} />
            <Route path="/blog/:id" exact component={ArticleItem} />
            {/* Requires Login */}
            <Route path="/blog/new" exact component={CreateArticle} />
            {/* <Route path="/blog/edit" exact component={!isLoggedIn ? CreateArticle : Error} /> */}
            {/* Requires Login */}
            {/* Blog */}

            {/* UserManagement */}
            {/* <Route path="/users" exact component={UsersList} /> */}
            {/* <Route path="/uploads" exact component={UploadList} /> */}
            {/* UserManagement */}

            {/* Shop */}
            {/* <Route path="/shop" exact render={() => (<Shop/>)}/>
            <Route path="/products" exact component={Products} />
            <Route path="/detail/:id" exact component={DetailProduct} /> */}
            {/* Requires Admin Authorization */}
            {/* <Route path="/create_product" exact component={!isAdmin ? CreateProduct: Error} />
            <Route path="/edit_product/:id" exact component={!isAdmin ? CreateProduct : Error} /> */}
            {/* Requires Admin Authorization */}
            {/* Requires Login */}
            {/* <Route path="/history" exact component={!isLoggedIn ? History : Error} />
            <Route path="/history/:id" exact component={!isLoggedIn ? OrderDetails : Error} /> */}
            {/* Requires Login */}
            {/* <Route path="/cart" exact component={Checkout} /> */}
            {/* Shop */}

          </DataProvider>
            {/* 404 */}
            <Route path="*" component={Error} />
            {/* 404 */}
        </Switch>
      </BrowserRouter>
    );
  // }
}


export default Sentry.withProfiler(App);
