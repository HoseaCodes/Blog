import React, { useContext, useState, useRef, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { useCookies } from "react-cookie";
import { friendlyAuthError } from "../../lib/stormGate";
import AuthShell, {
  AuthHeader,
  AuthKicker,
  AuthTitle,
  AuthSubtitle,
  AuthForm,
  Field,
  Input,
  CheckboxRow,
  SubmitBtn,
  Banner,
  AuthFooter,
} from "./AuthShell";

const Login = () => {
  const state = useContext(GlobalState);
  const history = useHistory();
  const [, setIsLoggedIn] = state.userAPI.isLoggedIn;
  const login = state.userAPI.login;

  const [rememberMe, setRememberMe] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [cookies, setCookie] = useCookies(["cookie-name"]);

  const isMountedRef = useRef(true);
  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    []
  );

  const [formData, setFormData] = useState({ email: "", password: "" });

  const onChangeInput = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
        rememberMe,
      });

      if (result.status === "PENDING") {
        history.push(`/pending?email=${encodeURIComponent(formData.email)}`);
        return;
      }
      if (result.status === "DENIED") {
        history.push("/denied");
        return;
      }

      // APPROVED — session cookie is set; mirror flags for PrivateRouter.
      localStorage.setItem("firstLogin", true);
      localStorage.setItem("isLoggedIn", true);
      setIsLoggedIn(true);
      history.push("/");
    } catch (err) {
      console.error("Login error:", err);
      if (isMountedRef.current) {
        setError(
          friendlyAuthError(err, "Login failed. Please check your credentials.")
        );
      }
    } finally {
      if (isMountedRef.current) setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthHeader>
        <AuthKicker>Welcome back</AuthKicker>
        <AuthTitle>Sign in to your account.</AuthTitle>
        <AuthSubtitle>
          Enter your email and password to continue.
        </AuthSubtitle>
      </AuthHeader>

      {error && <Banner tone="error">{error}</Banner>}

      <AuthForm onSubmit={loginSubmit}>
        <Field>
          <label htmlFor="email">Email</label>
          <Input
            type="email"
            name="email"
            id="email"
            required
            placeholder="you@email.com"
            autoComplete="email"
            value={formData.email}
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
            autoComplete="current-password"
            placeholder="••••••••"
            value={formData.password}
            onChange={onChangeInput}
          />
          <small
            style={{ color: "#5bb39e", cursor: "pointer", marginTop: 4 }}
            onClick={() => setShowPass((v) => !v)}
          >
            {showPass ? "Hide password" : "Show password"}
          </small>
        </Field>

        <CheckboxRow>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />
          Remember me
        </CheckboxRow>

        <SubmitBtn type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </SubmitBtn>
      </AuthForm>

      <AuthFooter>
        <Link to="/forgot-password">Forgot password?</Link>
        <span className="sep">•</span>
        <Link to="/check-status">Check status</Link>
        <span className="sep">•</span>
        <Link to="/register">Create account</Link>
      </AuthFooter>
    </AuthShell>
  );
};

export default Login;
