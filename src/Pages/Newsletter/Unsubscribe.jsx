import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { FiBellOff, FiAlertCircle } from "react-icons/fi";

const Page = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 64px 24px;
  background: #0f1216;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 48px 40px;
  text-align: center;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35);

  @media (max-width: 480px) {
    padding: 36px 24px;
  }
`;

const IconWrap = styled.div`
  width: 56px;
  height: 56px;
  margin: 0 auto 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ status }) =>
    status === "error" ? "rgba(248, 113, 113, 0.12)" : "rgba(163, 172, 178, 0.12)"};
  color: ${({ status }) => (status === "error" ? "#f87171" : "#a3acb2")};

  svg {
    width: 28px;
    height: 28px;
  }
`;

const Title = styled.h1`
  font-family: charter, Georgia, "Times New Roman", serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #f4f6f8;
  margin: 0 0 12px;
`;

const Message = styled.p`
  color: #a3acb2;
  font-family: "Lato", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 32px;
`;

const GhostLink = styled(Link)`
  display: inline-block;
  background: transparent;
  color: #5bb39e;
  padding: 12px 28px;
  border: 1px solid rgba(91, 179, 158, 0.4);
  border-radius: 10px;
  text-decoration: none;
  font-family: "Lato", sans-serif;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover {
    background: rgba(91, 179, 158, 0.1);
    border-color: rgba(91, 179, 158, 0.7);
    color: #5bb39e;
    text-decoration: none;
  }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: 28px;
  height: 28px;
  margin: 0 auto 20px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #5bb39e;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

export default function Unsubscribe() {
  const { token } = useParams();
  const [state, setState] = useState({ status: "loading", message: "" });

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`/api/subscribers/unsubscribe/${token}`)
      .then((res) => {
        if (!cancelled) {
          setState({ status: "success", message: res.data?.msg || "You've been unsubscribed." });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err.response?.data?.msg || "We couldn't process that unsubscribe link.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (state.status === "loading") {
    return (
      <Page>
        <Card>
          <Spinner />
          <Message>Processing your request…</Message>
        </Card>
      </Page>
    );
  }

  const isSuccess = state.status === "success";
  return (
    <Page>
      <Card>
        <IconWrap status={state.status}>
          {isSuccess ? <FiBellOff /> : <FiAlertCircle />}
        </IconWrap>
        <Title>{isSuccess ? "Unsubscribed." : "Something's off."}</Title>
        <Message>
          {state.message}
          {isSuccess && " Sorry to see you go."}
        </Message>
        <GhostLink to="/">Back to home</GhostLink>
      </Card>
    </Page>
  );
}
