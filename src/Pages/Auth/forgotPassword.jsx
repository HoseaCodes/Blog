import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../services/authService";
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
      setSuccess(
        data.msg || "Password reset link has been sent to your email."
      );
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.msg ||
          "Failed to send reset email. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthHeader>
        <AuthKicker>Reset password</AuthKicker>
        <AuthTitle>Forgot your password?</AuthTitle>
        <AuthSubtitle>
          Enter your email address and we'll send you a link to reset it.
        </AuthSubtitle>
      </AuthHeader>

      {error && <Banner tone="error">{error}</Banner>}
      {success && <Banner tone="success">{success}</Banner>}

      <AuthForm onSubmit={handleSubmit}>
        <Field>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            required
          />
        </Field>

        <SubmitBtn type="submit" disabled={loading}>
          {loading ? "Sending…" : "Send reset link"}
        </SubmitBtn>
      </AuthForm>

      <AuthFooter>
        <Link to="/login">Back to sign in</Link>
        <span className="sep">•</span>
        <Link to="/register">Create account</Link>
      </AuthFooter>
    </AuthShell>
  );
};

export default ForgotPassword;
