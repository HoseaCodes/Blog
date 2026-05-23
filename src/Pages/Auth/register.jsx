import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import "./auth.css";

const Register = () => {
  const state = useContext(GlobalState);
  const history = useHistory();
  const register = state.userAPI.register;

  const [showRole, setShowRole] = useState(false);
  const [secret, setSecret] = useState("");
  const [pass, setPass] = useState(false);
  const [initialPress, setInitialPress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 0
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validation = (input) => {
    let valid = true;
    let message = "";
    
    if (!input.name || input.name.length < 3) {
      valid = false;
      message = "Name must be at least 3 characters long";
    } else if (!input.email) {
      valid = false;
      message = "Email is required";
    } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.email)) {
      valid = false;
      message = "Please enter a valid email address";
    } else if (!input.password || input.password.length < 6) {
      valid = false;
      message = "Password must be at least 6 characters long";
    } else if (input.password !== input.confirmPassword) {
      valid = false;
      message = "Passwords do not match";
    }
    
    return { valid, message };
  };

  const showPassword = () => {
    let password = document.getElementById("password");
    if (pass && initialPress >= 1) {
      password.setAttribute('type', 'text');
    } else {
      password.setAttribute('type', 'password');
    }
    setPass(!pass);
    setInitialPress(initialPress + 1);
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { valid, message } = validation(formData);
    if (!valid) {
      setError(message);
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (result.requiresApproval) {
        setSuccess(result.message || 'Registration successful! Your account is pending approval.');
        setTimeout(() => history.push("/login"), 3000);
      } else {
        setSuccess('Registration successful! Redirecting...');
        localStorage.setItem("firstLogin", true);
        localStorage.setItem("isLoggedIn", true);
        setTimeout(() => history.push("/"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = () => {
    setShowRole(true);
  };

  const { name, email, password, confirmPassword, role } = formData;
  
  return (
    <div className="container-fluid">
      <div className="row login-row main-content bg-success text-center">
        <div className="col-md-4 text-center company__info">
          <Link to="/">
            <img className="brand" src="https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/newLogo.png" alt="brand-name" onClick={updateRole} />
          </Link>
        </div>
        <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
          <div className="container-fluid">
            <div className="row login-row">
              <h2>Register</h2>
            </div>
            {error && (
              <div className="row login-row">
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              </div>
            )}
            {success && (
              <div className="row login-row">
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              </div>
            )}
            <div className="row login-row">
              <form onSubmit={registerSubmit} className="">
                <div className="row login-row">
                  <input
                    className="form__input"
                    type="text"
                    name="name"
                    required
                    id="name"
                    placeholder="Your name here"
                    value={name}
                    onChange={onChangeInput}
                  />
                </div>
                <div className="row login-row">
                  <input
                    className="form__input"
                    type="email"
                    name="email"
                    id="e-mail"
                    required
                    placeholder="Your e-mail address"
                    value={email}
                    onChange={onChangeInput}
                  />
                </div>
                <div className="row login-row">
                  <input
                    className="form__input"
                    type="password"
                    name="password"
                    id="password"
                    required
                    autoComplete="on"
                    placeholder="Enter your password (min 6 characters)"
                    value={password}
                    onChange={onChangeInput}
                    onClick={showPassword}
                  />
                </div>
                <div className="row login-row">
                  <input
                    className="form__input"
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    required
                    autoComplete="on"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={onChangeInput}
                  />
                </div>
                {showRole === true && (
                  <div className="row login-row">
                    <input
                      className="form__input"
                      type="text"
                      name="secret"
                      id="secret"
                      required
                      autoComplete="on"
                      placeholder="Shhh...."
                      value={secret}
                      onInput={e => setSecret(e.target.value)}
                    />
                  </div>
                )}
                {secret === process.env.REACT_ROLE_SECRET_CODE && (
                  <div className="row login-row">
                    <input
                      className="form__input"
                      type="number"
                      name="role"
                      id="role"
                      required
                      autoComplete="on"
                      placeholder="role"
                      value={role}
                      onChange={onChangeInput}
                    />
                  </div>
                )}
                <div className="row login-row">
                  <input 
                    type="submit" 
                    value={loading ? "Registering..." : "Submit"} 
                    className="login-btn"
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
            <div className="row login-row">
              Already have an account? <Link to="/login">Log in here!</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
