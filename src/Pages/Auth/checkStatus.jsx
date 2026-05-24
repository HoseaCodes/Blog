import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
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

const StatusCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const StatusRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 13px;
  align-items: center;

  &:last-child {
    border-bottom: 0;
  }
  .k {
    color: #6b7479;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    font-size: 11px;
  }
  .v {
    color: #f4f6f8;
    word-break: break-word;
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  ${({ status }) =>
    status === "APPROVED"
      ? `
        background: rgba(91, 179, 158, 0.12);
        border: 1px solid rgba(91, 179, 158, 0.32);
        color: #5bb39e;
      `
      : status === "PENDING"
      ? `
        background: rgba(234, 179, 8, 0.1);
        border: 1px solid rgba(234, 179, 8, 0.32);
        color: #fcd34d;
      `
      : `
        background: rgba(248, 113, 113, 0.1);
        border: 1px solid rgba(248, 113, 113, 0.32);
        color: #f8b4b4;
      `}
`;

const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 11px 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  border: 1px solid rgba(255, 255, 255, 0.12);
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease,
    color 0.18s ease;
  flex: 1;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
    color: #ffffff;
    border-color: rgba(255, 255, 255, 0.22);
  }
`;

const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 4px;

  a {
    flex: 1;
    text-align: center;
    padding: 11px 18px;
    border-radius: 10px;
    background: #206a5d;
    color: #ffffff !important;
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: background 0.18s ease;
  }
  a:hover {
    background: #267a6b;
    text-decoration: none;
  }
`;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
      setError(
        err.response?.data?.msg ||
          "Failed to check status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      <AuthHeader>
        <AuthKicker>Account status</AuthKicker>
        <AuthTitle>
          {status ? "Account found." : "Check your status."}
        </AuthTitle>
        <AuthSubtitle>
          {status
            ? "Here's what we have on file for this email."
            : "Enter your registered email to see whether your account has been approved."}
        </AuthSubtitle>
      </AuthHeader>

      {!status && (
        <>
          {error && <Banner tone="error">{error}</Banner>}
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
              {loading ? "Checking…" : "Check status"}
            </SubmitBtn>
          </AuthForm>
        </>
      )}

      {status && (
        <StatusCard>
          <StatusRow>
            <span className="k">Name</span>
            <span className="v">{status.name}</span>
          </StatusRow>
          <StatusRow>
            <span className="k">Email</span>
            <span className="v">{status.email}</span>
          </StatusRow>
          <StatusRow>
            <span className="k">Status</span>
            <span>
              <StatusBadge status={status.status}>
                {status.status === "APPROVED"
                  ? "Approved"
                  : status.status === "PENDING"
                  ? "Pending"
                  : "Denied"}
              </StatusBadge>
            </span>
          </StatusRow>
          <StatusRow>
            <span className="k">Registered</span>
            <span className="v">
              {formatDate(status.createdAt || new Date())}
            </span>
          </StatusRow>

          {status.status === "PENDING" && (
            <Banner tone="info">
              Your account is pending administrator approval. You'll get an
              email once it's approved.
            </Banner>
          )}
          {status.status === "DENIED" && (
            <Banner tone="error">
              Your registration was denied. Please contact support for more
              information.
            </Banner>
          )}

          <ActionRow>
            <SecondaryBtn
              onClick={() => {
                setStatus(null);
                setEmail("");
              }}
            >
              Check another
            </SecondaryBtn>
            <Link to="/login">Sign in</Link>
          </ActionRow>
        </StatusCard>
      )}

      <AuthFooter>
        <Link to="/login">Back to sign in</Link>
        {!status && (
          <>
            <span className="sep">•</span>
            <Link to="/register">Create account</Link>
          </>
        )}
      </AuthFooter>
    </AuthShell>
  );
};

export default CheckStatus;
