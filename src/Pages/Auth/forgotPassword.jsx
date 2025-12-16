import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import "./auth.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const data = await authService.forgotPassword(email);
      setSuccess(data.msg || "Password reset link has been sent to your email.");
      setEmail(""); // Clear form
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <div className="row login-row main-content bg-success text-center">
        <div className="col-md-4 text-center company__info">
          <Link to="/">
            <img className="brand" src="https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/newLogo.png" alt="brand-name" />
          </Link>
        </div>
        <div className="col-md-8 col-xs-12 col-sm-12 login_form ">
          <div className="container-fluid">
            <div className="row login-row">
              <h2>Reset Password</h2>
              <p style={{ fontSize: '14px', marginTop: '10px' }}>
                Enter your email address and we'll send you a link to reset your password.
              </p>
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
              <form onSubmit={handleSubmit} className="">
                <div className="row login-row">
                  <input
                    className="form__input"
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className="row login-row">
                  <input
                    type="submit"
                    value={loading ? "Sending..." : "Send Reset Link"}
                    className="login-btn"
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
            <div className="row login-row">
              <Link to="/login">Back to Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
