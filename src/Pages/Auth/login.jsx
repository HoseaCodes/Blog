import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import "./auth.css";
import { useCookies } from "react-cookie";

const Login = () => {
  const Logo =
    "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/newLogo.png";
  const state = useContext(GlobalState);
  const history = useHistory();
  const [user, setUser] = state.userAPI.user;
  const [isLoggedIn, setIsLoggedIn] = state.userAPI.isLoggedIn;
  const login = state.userAPI.login;

  const [pass, setPass] = useState(false);
  const [initialPress, setInitialPress] = useState(0);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cookies, setCookie] = useCookies(["cookie-name"]);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe
      });

      if (result.limitedAccess) {
        setError(result.message || 'Your account is pending approval. Limited access granted.');
        localStorage.setItem("isLoggedIn", true);
        setIsLoggedIn(true);
        setTimeout(() => history.push("/profile"), 2000);
      } else {
        localStorage.setItem("firstLogin", true);
        localStorage.setItem("isLoggedIn", true);
        setIsLoggedIn(true);
        history.push("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const showPassword = () => {
    let password = document.getElementById("password");
    if (pass && initialPress >= 1) {
      password.setAttribute("type", "text");
    } else {
      password.setAttribute("type", "password");
    }
    setPass(!pass);
    setInitialPress(initialPress + 1);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row login-row main-content bg-success text-center">
          <div className="col-md-4 text-center company__info">
            <Link to="/">
              <img className="brand" src={Logo} alt="brand-name" />
            </Link>
          </div>
          <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
            <div className="container-fluid">
              <div className="row login-row">
                <h2>Log In</h2>
              </div>
              {error && (
                <div className="row login-row">
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                </div>
              )}
              <div className="row login-row">
                <form onSubmit={loginSubmit} className="">
                  <div className="row login-row">
                    <input
                      className="form__input"
                      type="email"
                      name="email"
                      id="e-mail"
                      required
                      placeholder="E-mail Address"
                      value={formData.email}
                      onChange={onChangeInput}
                    />
                  </div>
                  <div className="row login-row">
                    <input
                      type="password"
                      name="password"
                      id="password"
                      required
                      autoComplete="on"
                      placeholder="Enter your password"
                      value={formData.password}
                      className="form__input"
                      onChange={onChangeInput}
                      onClick={showPassword}
                    />
                  </div>
                  <div className="row login-row">
                    <input
                      onClick={() => setRememberMe(!rememberMe)}
                      type="checkbox"
                      name="remember_me"
                      id="remember_me"
                      className=""
                    />
                    &nbsp;&nbsp;
                    <label htmlFor="remember_me">Remember Me!</label>
                  </div>
                  <div className="row login-row">
                    <input 
                      type="submit" 
                      value={loading ? "Logging in..." : "Submit"} 
                      className="login-btn"
                      disabled={loading}
                    />
                  </div>
                </form>
              </div>
              <div className="row login-row">
                <p>
                  <Link to="/forgot-password">Forgot password?</Link>
                  <span> • </span>
                  <Link to="/register">Sign up here!</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
