import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import styled, { keyframes } from "styled-components";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";

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
    status === "error" ? "rgba(248, 113, 113, 0.12)" : "rgba(91, 179, 158, 0.12)"};
  color: ${({ status }) => (status === "error" ? "#f87171" : "#5bb39e")};

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

const PrimaryLink = styled(Link)`
  display: inline-block;
  background: #206a5d;
  color: #ffffff;
  padding: 12px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-family: "Lato", sans-serif;
  font-size: 15px;
  font-weight: 600;
  transition: background 0.18s ease, transform 0.12s ease, box-shadow 0.18s ease;
  box-shadow: 0 8px 22px rgba(32, 106, 93, 0.28);

  &:hover {
    background: #267a6b;
    transform: translateY(-1px);
    color: #ffffff;
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

export default function Verify() {
  const { token } = useParams();
  const [state, setState] = useState({ status: "loading", message: "" });

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`/api/subscribers/verify/${token}`)
      .then((res) => {
        if (!cancelled) {
          setState({ status: "success", message: res.data?.msg || "Subscription confirmed." });
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setState({
            status: "error",
            message: err.response?.data?.msg || "Verification failed. Try signing up again.",
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
          <Message>Confirming your subscription…</Message>
        </Card>
      </Page>
    );
  }

  const isSuccess = state.status === "success";
  return (
    <Page>
      <Card>
        <IconWrap status={state.status}>
          {isSuccess ? <FiCheckCircle /> : <FiAlertCircle />}
        </IconWrap>
        <Title>{isSuccess ? "You're in." : "Something's off."}</Title>
        <Message>{state.message}</Message>
        <PrimaryLink to="/blog">Read the latest</PrimaryLink>
      </Card>
    </Page>
  );
}
