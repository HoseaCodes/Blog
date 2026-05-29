import React, { useState, useEffect } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { auth } from "../../lib/stormGate";
import AuthShell, {
  AuthHeader,
  AuthKicker,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  Field,
  Input,
  SubmitBtn,
  Banner,
  AuthFooter,
} from "./AuthShell";

const ResetPassword = () => {
  const history = useHistory();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [tokenValid, setTokenValid] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setError(
          "Invalid reset link. Please request a new password reset."
        );
        setVerifying(false);
        return;
      }
      try {
        await auth.verifyResetToken(token);
        setTokenValid(true);
      } catch (err) {
        setError(
          err.response?.data?.msg ||
            "Invalid or expired reset link. Please request a new one."
        );
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

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
      const data = await auth.resetPassword({ token, password: formData.password });
      setSuccess(
        data.msg || "Password reset successful! Redirecting to sign in…"
      );
      setTimeout(() => history.push("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <AuthShell>
        <AuthHeader>
          <AuthKicker>Verifying</AuthKicker>
          <AuthTitle>Checking your reset link…</AuthTitle>
          <AuthSubtitle>This should only take a moment.</AuthSubtitle>
        </AuthHeader>
      </AuthShell>
    );
  }

  if (!tokenValid) {
    return (
      <AuthShell>
        <AuthHeader>
          <AuthKicker>Invalid link</AuthKicker>
          <AuthTitle>Reset link expired.</AuthTitle>
        </AuthHeader>
        <Banner tone="error">{error}</Banner>
        <AuthFooter>
          <Link to="/forgot-password">Request new link</Link>
          <span className="sep">•</span>
          <Link to="/login">Back to sign in</Link>
        </AuthFooter>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthHeader>
        <AuthKicker>New password</AuthKicker>
        <AuthTitle>Set a new password.</AuthTitle>
        <AuthSubtitle>
          Choose something at least 6 characters long that you'll remember.
        </AuthSubtitle>
      </AuthHeader>

      {error && <Banner tone="error">{error}</Banner>}
      {success && <Banner tone="success">{success}</Banner>}

      <AuthForm onSubmit={handleSubmit}>
        <Field>
          <label htmlFor="password">New password</label>
          <Input
            type={showPass ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="At least 6 characters"
            autoComplete="new-password"
            required
            minLength={6}
          />
          <small
            style={{ color: "#5bb39e", cursor: "pointer", marginTop: 4 }}
            onClick={() => setShowPass((v) => !v)}
          >
            {showPass ? "Hide password" : "Show password"}
          </small>
        </Field>
        <Field>
          <label htmlFor="confirmPassword">Confirm new password</label>
          <Input
            type={showPass ? "text" : "password"}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            autoComplete="new-password"
            required
          />
        </Field>

        <SubmitBtn type="submit" disabled={loading}>
          {loading ? "Resetting…" : "Reset password"}
        </SubmitBtn>
      </AuthForm>

      <AuthFooter>
        <Link to="/login">Back to sign in</Link>
      </AuthFooter>
    </AuthShell>
  );
};

export default ResetPassword;
