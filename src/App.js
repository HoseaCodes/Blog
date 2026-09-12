import React, { lazy, Suspense, useEffect, useState } from "react";
import * as Sentry from "@sentry/react";
import { CookiesProvider } from "react-cookie";
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
import NewsletterVerify from "./Pages/Newsletter/Verify";
import NewsletterUnsubscribe from "./Pages/Newsletter/Unsubscribe";
import Saved from "./Pages/Saved/Saved";
import ProjectItem from "./Pages/Projects/Project/Project";
import CaseStudies from "./Pages/CaseStudies/CaseStudies";
import CaseStudyItem from "./Pages/CaseStudies/CaseStudy/CaseStudy";
import CaseStudyEntry from "./Pages/CaseStudies/CaseStudyEntry";
import Login from "./Pages/Auth/login";
import Register from "./Pages/Auth/register";
import ForgotPassword from "./Pages/Auth/forgotPassword";
import ResetPassword from "./Pages/Auth/resetPassword";
import CheckStatus from "./Pages/Auth/checkStatus";
import Pending from "./Pages/Auth/pending";
import Denied from "./Pages/Auth/denied";
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
import CreateArt from "./Pages/Shop/CreateArt";
import Downloads from "./Pages/Order/Downloads";
import RedeemStore from "./Pages/Shop/RedeemStore";
import UploadList from "./Components/User/UploadList";
import AdminOverview from "./Pages/Admin/AdminOverview";
import AdminBlogs from "./Pages/Admin/AdminBlogs";
import AdminProducts from "./Pages/Admin/AdminProducts";
import AdminArt from "./Pages/Admin/AdminArt";
import PrivateRoute from "./PrivateRouter";
import Tools from "./Pages/Tools";
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

  return (
    <BrowserRouter history={history}>
      <CookiesProvider defaultSetOptions={{ path: '/' }}>
        <DataProvider>
          <GameScoreProvider>
            <Layout>
              <Suspense fallback={<ProLoader />}>
                <Switch>
                <Route exact={true} path="/" render={() => <Home />} />
                  {/* Static */}
                  <Route path="/about" exact={true} component={About} />
                  <Route path="/contact" exact={true} component={Contact} />
                  {/* Static */}
                {/* Blog */}
                <Route path="/blog" exact={true} component={Articles} />
                <Route path="/blog/:id" exact={true} component={ArticleItem} />
                <Route path="/newsletter/verify/:token" exact={true} component={NewsletterVerify} />
                <Route path="/newsletter/unsubscribe/:token" exact={true} component={NewsletterUnsubscribe} />
                <Route path="/saved" exact={true} component={Saved} />
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
                <Route path="/pending" exact={true} component={Pending} />
                <Route path="/denied" exact={true} component={Denied} />
                {/* Authentication */}
                {/* Showcase */}
                <Route path="/project" exact={true} component={Projects} />
                <Route path="/project/:id" exact={true} component={ProjectItem} />
                <Route path="/case-studies" exact={true} component={CaseStudies} />
                <Route path="/case-studies/:group/:study" exact={true} component={CaseStudyItem} />
                <Route path="/case-studies/:slug" exact={true} component={CaseStudyEntry} />
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
                  path="/admin"
                  exact={true}
                  element={AdminOverview}
                />
                <PrivateRoute
                  type={"admin"}
                  path="/admin/blogs"
                  exact={true}
                  element={AdminBlogs}
                />
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
                <PrivateRoute
                  type={"admin"}
                  path="/admin/products"
                  exact={true}
                  element={AdminProducts}
                />
                <PrivateRoute
                  type={"admin"}
                  path="/admin/art"
                  exact={true}
                  element={AdminArt}
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
                  path="/shop/create-art"
                  exact={true}
                  element={CreateArt}
                />
                <PrivateRoute
                  type={"login"}
                  path="/shop/my-art"
                  exact={true}
                  element={Downloads}
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
                <Route
                  path="/shop/redeem"
                  exact={true}
                  render={() => <RedeemStore />}
                />
                {/* Shop */}
                {/* Tools */}
                <Route path="/tools" exact render={() => (<Tools />)} />
                {/* Game center relocated to asperiagames.com. Redirect old
                    /gamecorner* links (non-exact match covers subpaths). */}
                <Route
                  path="/gamecorner"
                  render={() => {
                    window.location.replace("https://asperiagames.com");
                    return null;
                  }}
                />
                  {/* 404 — catch-all, must remain last */}
                  <Route component={Error} />
                </Switch>
              </Suspense>
            </Layout>
          </GameScoreProvider>
        </DataProvider>
      </CookiesProvider>
    </BrowserRouter>
  );
};

export default Sentry.withProfiler(App);
