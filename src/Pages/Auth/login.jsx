import React, { useContext, useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import { GlobalState } from '../../GlobalState';

import "./auth.css";
import Logo from "../../Assets/Images/newLogo.png";

const Login = () => {
  const state = useContext(GlobalState)
  const [user, setUser] = state.userAPI.user
  const [pass, setPass] = useState(false)
  const [initialPress, setInitialPress] = useState(0)
  const [rememberMe, setRememberMe] = useState(false)

   const onChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const loginSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/user/login", { ...user, rememberMe });
			localStorage.setItem("firstLogin", true);
			// window.location.href = "/";
		} catch (err) {
			alert(err.response.data.msg);
		}
	};

	const showPassword = () => {
		let password = document.getElementById("password")
		if (pass && initialPress >= 1) {
			password.setAttribute('type', 'text')
		} else {
			password.setAttribute('type', 'password')
		}
		setPass(!pass)
		setInitialPress(initialPress + 1)
	}

	return (
		<>
			<div className="container-fluid">
				<div className="row login-row main-content bg-success text-center">
					<div className="col-md-4 text-center company__info">
						<Link to="/">
							<img className="brand" src={Logo} alt="brand-name" />
							{/* <img className="brand" src="https://i.imgur.com/xycLsso.png" alt="brand-name" /> */}
						</Link>
					</div>
					<div className="col-md-8 col-xs-12 col-sm-12 login_form ">
						<div className="container-fluid">
							<div className="row login-row">
								<h2>Log In</h2>
							</div>
							<div className="row login-row">
								<form onSubmit={loginSubmit} className="form-group">
									<div className="row login-row">
										<input
											className="form__input"
											type="email"
											name="email"
											id="e-mail"
											required
											placeholder="E-mail Address"
											value={user.email}
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
											value={user.password}
											className="form__input"
											onChange={onChangeInput}
											onClick={showPassword}
										/>
									</div>
									<div className="row login-row">
										<input onClick={() => setRememberMe(!rememberMe)} type="checkbox" name="remember_me" id="remember_me" className=""/>
										&nbsp;&nbsp;
										<label for="remember_me">Remember Me!</label>
									</div>
									<div className="row login-row">
										<input type="submit" value="Submit" className="login-btn"/>
									</div>
								</form>
							</div>
							<div className="row login-row">
								<p>Not yet signed up? <Link to="/register">Sign up here!</Link></p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Login;
