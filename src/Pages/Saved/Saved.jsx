import React, { useContext, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import moment from "moment";
import { FaRegBookmark } from "react-icons/fa";
import { GlobalState } from "../../GlobalState";

const Page = styled.div`
  min-height: calc(100vh - 200px);
  background: #0f1216;
  color: #f4f6f8;
  padding: 64px 24px;
  font-family: "Lato", -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Container = styled.div`
  max-width: 880px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
`;

const Title = styled.h1`
  font-family: charter, Georgia, serif;
  font-size: 34px;
  font-weight: 700;
  color: #f4f6f8;
  margin: 0;
  letter-spacing: -0.01em;
`;

const Subtitle = styled.p`
  color: #a3acb2;
  font-size: 15px;
  margin: 0 0 32px;
`;

const Empty = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;

  svg {
    color: #6b7479;
    margin-bottom: 16px;
  }

  p {
    color: #a3acb2;
    margin: 0 0 8px;
  }

  a {
    color: #5bb39e;
    text-decoration: none;
    font-weight: 600;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  transition: border-color 0.2s ease, transform 0.2s ease, background 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(91, 179, 158, 0.25);
    transform: translateY(-2px);
  }
`;

const CardTitle = styled.h2`
  font-family: charter, Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  margin: 0 0 8px;

  a {
    color: #f4f6f8;
    text-decoration: none;

    &:hover {
      color: #5bb39e;
    }
  }
`;

const CardMeta = styled.div`
  color: #6b7479;
  font-size: 13px;
  margin-bottom: 12px;
`;

const CardDescription = styled.p`
  color: #a3acb2;
  font-size: 15px;
  line-height: 1.6;
  margin: 0;
`;

const Loading = styled.p`
  color: #a3acb2;
  text-align: center;
  padding: 64px 0;
`;

export default function Saved() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const history = useHistory();
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | ready | error

  useEffect(() => {
    if (!token) {
      history.push("/login");
      return;
    }
    let cancelled = false;
    axios
      .get("/api/articles/saved", { headers: { Authorization: token } })
      .then((res) => {
        if (!cancelled) {
          setArticles(res.data?.articles || []);
          setStatus("ready");
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load saved articles:", err);
          setStatus("error");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [token, history]);

  return (
    <Page>
      <Container>
        <Header>
          <FaRegBookmark size={28} color="#5bb39e" />
          <Title>Saved articles</Title>
        </Header>
        <Subtitle>Posts you've bookmarked. Newest saved first.</Subtitle>

        {status === "loading" && <Loading>Loading…</Loading>}

        {status === "error" && (
          <Empty>
            <p>Couldn't load your saved articles. Try refreshing.</p>
          </Empty>
        )}

        {status === "ready" && articles.length === 0 && (
          <Empty>
            <FaRegBookmark size={32} />
            <p>You haven't saved anything yet.</p>
            <p>
              <Link to="/blog">Browse the blog</Link> and tap the bookmark icon on any post.
            </p>
          </Empty>
        )}

        {status === "ready" &&
          articles.map((article) => (
            <Card key={article._id}>
              <CardTitle>
                <Link to={`/blog/${article.slug || article._id}`}>{article.title}</Link>
              </CardTitle>
              <CardMeta>
                {article.createdAt && moment(article.createdAt).format("MMMM Do, YYYY")}
                {article.categories?.[0] && ` · ${article.categories[0]}`}
              </CardMeta>
              {article.description && <CardDescription>{article.description}</CardDescription>}
            </Card>
          ))}
      </Container>
    </Page>
  );
}
