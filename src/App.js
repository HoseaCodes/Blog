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

const About = lazy(() => import("./Pages/About/About"));
const Contact = lazy(() => import("./Pages/Contact/Contact"));


const App = () => {
    const history = createBrowserHistory();
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
              {/* UserManagement */}
              <PrivateRoute type={"login"} path="/profile" exact={true} element={Profile} />
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
              {/* 404 */}
              <Route path="*" component={Error} />
              {/* 404 */}
            </Layout>
          </DataProvider>
        </Switch>
      </BrowserRouter>
    );
}


export default Sentry.withProfiler(App);
