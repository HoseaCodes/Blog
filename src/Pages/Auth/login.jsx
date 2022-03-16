import React, { useContext } from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import { GlobalState } from '../../GlobalState';
import "./login.css";
import Logo from "../../Assets/Images/newLogo.png";

const Login = () => {
  const state = useContext(GlobalState)
  const [user, setUser] = state.userAPI.user

  const onChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};
  // console.log(user)

	const loginSubmit = async (e) => {
		e.preventDefault();
		try {
			await axios.post("/api/user/login", { ...user });
			localStorage.setItem("firstLogin", true);
			window.location.href = "/";
		} catch (err) {
			alert(err.response.data.msg);
		}
	};

	return (
		<div id="login-page-container">
			<div className="login-page">
				<Link to="/">
                    <img className="brand" src={Logo} alt="brand-name" />
                    {/* <img className="brand" src="https://i.imgur.com/xycLsso.png" alt="brand-name" /> */}
				</Link>
				<form onSubmit={loginSubmit}>
					<h2 className="login-title">Sign in to your account</h2>
					<p></p>
					<label htmlFor="e-mail">E-mail</label>
					<input
						type="email"
						name="email"
						id="e-mail"
						required
						placeholder="Your e-mail address"
						value={user.email}
						onChange={onChangeInput}
					/>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						required
						autoComplete="on"
						placeholder="Enter your password"
						value={user.password}
						onChange={onChangeInput}
					/>

					<div className="row">
						<button type="submit">Login</button>
						<div>
							Not yet signed up? <Link to="/register">Sign up here!</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
