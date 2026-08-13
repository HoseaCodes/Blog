import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../lib/stormGate";
import AuthShell, {
  AuthHeader,
  AuthKicker,
  AuthTitle,
  AuthSubtitle,
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

const Denied = () => {
  const handleLogout = async () => {
    await auth.logout();
  };

  return (
    <AuthShell>
      <AuthHeader>
        <AuthKicker>Account denied</AuthKicker>
        <AuthTitle>This account isn't approved.</AuthTitle>
        <AuthSubtitle>
          An administrator denied access to this account. If you think this is a
          mistake, please reach out and we'll take a look.
        </AuthSubtitle>
      </AuthHeader>

      <Banner tone="error">
        Access has been denied. Logging in again won't change this — please
        contact support to appeal.
      </Banner>

      <ActionRow>
        <Link to="/contact" className="primary">
          Contact support
        </Link>
        <button type="button" onClick={handleLogout}>
          Sign out
        </button>
      </ActionRow>

      <AuthFooter>
        <Link to="/">Back to homepage</Link>
      </AuthFooter>
    </AuthShell>
  );
};

export default Denied;
