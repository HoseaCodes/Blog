import React, { useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";

import "./login.css";
import Logo from "../../Assets/Images/newLogo.png";

const Register = () => {
  const [showRole, setShowRole] = useState(false);
  const [secret, setSecret] = useState("");
	const [user, setUser] = useState({
		name: "",
		email: "",
		password: "",
		role: 0
	});

	const onChangeInput = (e) => {
		const { name, value } = e.target;
		setUser({ ...user, [name]: value });
	};

	const validation = (input) => {
		let valid = true
		let message = ""
		if (input.name) {
			valid = typeof input.name === 'string'
			valid = input.name.length >= 3
			message = "Name only accepts string characters and must be greater than 3"
		} else if (input.password) {
			valid = typeof input.password === 'string'
			valid = input.password.length >= 6
			message = "Password must be greater than 6 charaters"
		} else if (input.email) {
			valid = typeof input === 'string'
			let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
			valid = input.email.match(regex)
			message = "Email only accepts in email format"
		}
		return {valid, message}
	}

	const registerSubmit = async (e) => {
		e.preventDefault();
		try {
			const {valid, message} = validation(user)
			if (valid) {
				await axios.post("/api/user/register", { ...user });
	
				localStorage.setItem("firstLogin", true);
	
				window.location.href = "/";
			} else {
				alert(message)
			}
		} catch (err) {
			alert(err.response.data.msg);
		}
	};

  const updateRole = () => {
      setShowRole(true);
  }

	const {name, email, password, role} = user;
	return (
		<div id="login-page-container">
			<div className="login-page">
        <img onClick={updateRole}  src={Logo} alt="brand-name" />
				<form onSubmit={registerSubmit}>
					<h2>Registration</h2>
					<label htmlFor="name">Name</label>
					<input
						type="text"
						name="name"
						required
						id="name"
						placeholder="Your name here"
						value={name}
						onChange={onChangeInput}
					/>
					<label htmlFor="e-mail">E-mail</label>
					<input
						type="email"
						name="email"
						id="e-mail"
						required
						placeholder="Your e-mail address"
						value={email}
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
						value={password}
						onChange={onChangeInput}
					/>
          {
            showRole === true ?
            <>
              <label htmlFor="secret">Secret</label>
              <input
                type="text"
                name="secret"
                id="secret"
                required
                autoComplete="on"
                placeholder="Shhh...."
                value={secret}
                onInput={e => setSecret(e.target.value)}
                />
              </>
            :
            null
          }
          {
            secret === process.env.REACT_ROLE_SECRET_CODE ?
            <>
            <label htmlFor="role">Role</label>
            <input
              type="number"
              name="role"
              id="role"
              required
              autoComplete="on"
              placeholder="role"
              value={role}
              onChange={onChangeInput}
              />
            </>
            :
            null
          }
					<div className="row">
						<button type="submit">Register</button>
						<div>
							Already have an account? <Link to="/login">Log in here!</Link>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Register;
