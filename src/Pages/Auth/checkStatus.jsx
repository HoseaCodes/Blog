import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
import "./auth.css";
import Logo from "../../Assets/Images/newLogo.png";

const CheckStatus = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus(null);
    setLoading(true);

    try {
      const data = await authService.checkStatus(email);
      setStatus(data.user);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to check status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (userStatus) => {
    const badges = {
      APPROVED: { text: "Approved", className: "badge badge-success" },
      PENDING: { text: "Pending Approval", className: "badge badge-warning" },
      DENIED: { text: "Denied", className: "badge badge-danger" }
    };
    return badges[userStatus] || badges.APPROVED;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
              <h2>Check Registration Status</h2>
            </div>

            {!status && (
              <>
                {error && (
                  <div className="row login-row">
                    <div className="alert alert-danger" role="alert">
                      {error}
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
                        placeholder="Enter your registered email"
                        required
                      />
                    </div>
                    <div className="row login-row">
                      <input
                        type="submit"
                        value={loading ? "Checking..." : "Check Status"}
                        className="login-btn"
                        disabled={loading}
                      />
                    </div>
                  </form>
                </div>
              </>
            )}

            {status && (
              <div className="row login-row">
                <div style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '8px',
                  textAlign: 'left',
                  maxWidth: '500px',
                  margin: '0 auto'
                }}>
                  <h3 style={{ marginBottom: '15px', color: '#333' }}>Account Status</h3>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#555' }}>Name:</strong>{" "}
                    <span style={{ color: '#333' }}>{status.name}</span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#555' }}>Email:</strong>{" "}
                    <span style={{ color: '#333' }}>{status.email}</span>
                  </div>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: '#555' }}>Status:</strong>{" "}
                    <span className={getStatusBadge(status.status).className}>
                      {getStatusBadge(status.status).text}
                    </span>
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <strong style={{ color: '#555' }}>Registered:</strong>{" "}
                    <span style={{ color: '#333' }}>
                      {formatDate(status.createdAt || new Date())}
                    </span>
                  </div>

                  {status.status === "PENDING" && (
                    <div className="alert alert-warning" style={{ marginTop: '15px' }}>
                      Your account is pending administrator approval. You'll receive an email
                      once approved.
                    </div>
                  )}

                  {status.status === "DENIED" && (
                    <div className="alert alert-danger" style={{ marginTop: '15px' }}>
                      Your registration was denied. Please contact support for more information.
                    </div>
                  )}

                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <button
                      className="login-btn"
                      onClick={() => {
                        setStatus(null);
                        setEmail("");
                      }}
                      style={{ marginRight: '10px' }}
                    >
                      Check Another
                    </button>
                    <Link to="/login" className="login-btn" style={{ display: 'inline-block' }}>
                      Go to Login
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="row login-row">
              <Link to="/login">Back to Login</Link>
              {!status && (
                <>
                  <span> • </span>
                  <Link to="/register">Create Account</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckStatus;
