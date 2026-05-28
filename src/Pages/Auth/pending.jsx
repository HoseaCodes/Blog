import React, { useEffect, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { auth, friendlyAuthError } from "../../lib/stormGate";
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

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;

  button,
  a {
    flex: 1;
    text-align: center;
    padding: 11px 18px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.02);
    color: #d2d8da;
    font-family: "Lato", sans-serif;

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.22);
      text-decoration: none;
    }
  }

  .primary {
    background: #206a5d;
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.08);

    &:hover {
      background: #267a6b;
      color: #ffffff;
    }
  }
`;

const Pending = () => {
  const history = useHistory();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialEmail = params.get("email") || "";

  const [email, setEmail] = useState(initialEmail);
  const [status, setStatus] = useState("PENDING");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // If they arrived with an email, do an initial silent refresh so a stale
  // tab can flip itself APPROVED/DENIED without the user clicking.
  useEffect(() => {
    if (!initialEmail) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await auth.checkStatus({ email: initialEmail });
        if (!cancelled && data?.user?.status) setStatus(data.user.status);
      } catch (_) {
        /* silent — they can click Check again */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialEmail]);

  const refresh = async (e) => {
    e?.preventDefault?.();
    setError("");
    setMessage("");
    if (!email) {
      setError("Enter the email you registered with.");
      return;
    }
    setLoading(true);
    try {
      const data = await auth.checkStatus({ email });
      const next = data?.user?.status;
      if (next === "APPROVED") {
        setStatus("APPROVED");
        setMessage("You're approved! Sign in to continue.");
      } else if (next === "DENIED") {
        history.push("/denied");
      } else {
        setStatus("PENDING");
        setMessage("Still pending — we'll let you know as soon as it changes.");
      }
    } catch (err) {
      setError(friendlyAuthError(err, "Couldn't check status. Try again."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.logout();
  };

  const approved = status === "APPROVED";

  return (
    <AuthShell>
      <AuthHeader>
        <AuthKicker>{approved ? "Account approved" : "Awaiting approval"}</AuthKicker>
        <AuthTitle>
          {approved ? "You're in." : "Thanks — we're reviewing your account."}
        </AuthTitle>
        <AuthSubtitle>
          {approved
            ? "An admin approved your account. Sign in to continue."
            : "An admin will review your sign-up shortly. You'll be able to log in once it's approved."}
        </AuthSubtitle>
      </AuthHeader>

      {error && <Banner tone="error">{error}</Banner>}
      {message && <Banner tone={approved ? "success" : "info"}>{message}</Banner>}

      {!approved && (
        <AuthForm onSubmit={refresh}>
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
            {loading ? "Checking…" : "Check again"}
          </SubmitBtn>
        </AuthForm>
      )}

      <ActionRow>
        {approved ? (
          <Link to="/login" className="primary">
            Sign in
          </Link>
        ) : (
          <button type="button" onClick={handleLogout}>
            Sign out
          </button>
        )}
      </ActionRow>

      <AuthFooter>
        <Link to="/login">Back to sign in</Link>
        <span className="sep">•</span>
        <Link to="/contact">Contact support</Link>
      </AuthFooter>
    </AuthShell>
  );
};

export default Pending;
