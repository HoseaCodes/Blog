import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
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

const Register = () => {
  const state = useContext(GlobalState);
  const history = useHistory();
  const register = state.userAPI.register;

  const [showRole, setShowRole] = useState(false);
  const [secret, setSecret] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: 0,
  });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validation = (input) => {
    if (!input.name || input.name.length < 3) {
      return { valid: false, message: "Name must be at least 3 characters long" };
    }
    if (!input.email) {
      return { valid: false, message: "Email is required" };
    }
    if (
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(input.email)
    ) {
      return { valid: false, message: "Please enter a valid email address" };
    }
    if (!input.password || input.password.length < 6) {
      return {
        valid: false,
        message: "Password must be at least 6 characters long",
      };
    }
    if (input.password !== input.confirmPassword) {
      return { valid: false, message: "Passwords do not match" };
    }
    return { valid: true, message: "" };
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
        role: formData.role,
      });

      if (result.requiresApproval) {
        setSuccess(
          result.message ||
            "Registration successful! Your account is pending approval."
        );
        setTimeout(() => history.push("/login"), 3000);
      } else {
        setSuccess("Registration successful! Redirecting…");
        localStorage.setItem("firstLogin", true);
        localStorage.setItem("isLoggedIn", true);
        setTimeout(() => history.push("/"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const { name, email, password, confirmPassword, role } = formData;

  return (
    <AuthShell>
      <AuthHeader>
        <AuthKicker
          onDoubleClick={() => setShowRole(true)}
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          Create account
        </AuthKicker>
        <AuthTitle>Start your account.</AuthTitle>
        <AuthSubtitle>
          Tell us who you are. Accounts may require manual approval.
        </AuthSubtitle>
      </AuthHeader>

      {error && <Banner tone="error">{error}</Banner>}
      {success && <Banner tone="success">{success}</Banner>}

      <AuthForm onSubmit={registerSubmit}>
        <Field>
          <label htmlFor="name">Name</label>
          <Input
            type="text"
            name="name"
            id="name"
            required
            placeholder="Your full name"
            value={name}
            onChange={onChangeInput}
          />
        </Field>
        <Field>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            name="email"
            id="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
            value={email}
            onChange={onChangeInput}
          />
        </Field>
        <Field>
          <label htmlFor="password">Password</label>
          <Input
            type={showPass ? "text" : "password"}
            name="password"
            id="password"
            required
            autoComplete="new-password"
            placeholder="At least 6 characters"
            value={password}
            onChange={onChangeInput}
          />
          <small
            style={{ color: "#5bb39e", cursor: "pointer", marginTop: 4 }}
            onClick={() => setShowPass((v) => !v)}
          >
            {showPass ? "Hide password" : "Show password"}
          </small>
        </Field>
        <Field>
          <label htmlFor="confirmPassword">Confirm password</label>
          <Input
            type={showPass ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
            required
            autoComplete="new-password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={onChangeInput}
          />
        </Field>

        {showRole && (
          <Field>
            <label htmlFor="secret">Secret code</label>
            <Input
              type="text"
              name="secret"
              id="secret"
              placeholder="Shhh…"
              autoComplete="off"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
          </Field>
        )}

        {secret === process.env.REACT_ROLE_SECRET_CODE && showRole && (
          <Field>
            <label htmlFor="role">Role</label>
            <Input
              type="number"
              name="role"
              id="role"
              required
              autoComplete="off"
              placeholder="Role"
              value={role}
              onChange={onChangeInput}
            />
          </Field>
        )}

        <SubmitBtn type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </SubmitBtn>
      </AuthForm>

      <AuthFooter>
        Already have an account?
        <Link to="/login">Sign in</Link>
      </AuthFooter>
    </AuthShell>
  );
};

export default Register;
