import React, { useState, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import authService from "../../services/authService";
import "./auth.css";
import Logo from "../../Assets/Images/newLogo.png";

const ResetPassword = () => {
  const history = useHistory();
  const location = useLocation();
  
  // Get token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: ""
  });

  const [tokenValid, setTokenValid] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError("Invalid reset link. Please request a new password reset.");
        setVerifying(false);
        return;
      }

      try {
        await authService.verifyResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setError(err.response?.data?.msg || "Invalid or expired reset link. Please request a new one.");
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const data = await authService.resetPassword(token, formData.password);
      setSuccess(data.msg || "Password reset successful! Redirecting to login...");

      // Redirect to login after 3 seconds
      setTimeout(() => history.push("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="container-fluid">
        <div className="row login-row main-content bg-success text-center">
          <div className="col-md-12 text-center">
            <p>Verifying reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
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
                <h2>Invalid Link</h2>
              </div>
              <div className="row login-row">
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              </div>
              <div className="row login-row">
                <Link to="/forgot-password">Request new reset link</Link>
                <span> • </span>
                <Link to="/login">Back to Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
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
              <h2>Set New Password</h2>
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
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="New Password"
                    required
                    minLength={6}
                  />
                  <small style={{ display: 'block', textAlign: 'left', marginTop: '5px' }}>
                    Minimum 6 characters
                  </small>
                </div>
                <div className="row login-row">
                  <input
                    className="form__input"
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    required
                  />
                </div>
                <div className="row login-row">
                  <input
                    type="submit"
                    value={loading ? "Resetting..." : "Reset Password"}
                    className="login-btn"
                    disabled={loading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
