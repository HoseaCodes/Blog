import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { FaTrash } from "react-icons/fa";

const Section = styled.section`
  margin: 24px 0;
  padding: 20px 22px;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: #f4f6f8;
`;

const Header = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
`;

const Title = styled.h3`
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
  margin: 0;
`;

const Count = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6b7479;
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Item = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.04);
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Who = styled.div`
  font-size: 12px;
  color: #a3acb2;
  margin-bottom: 4px;

  .name {
    color: #f4f6f8;
    font-weight: 600;
    margin-right: 6px;
  }
`;

const Text = styled.p`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #d6dade;
  word-break: break-word;
`;

const DeleteBtn = styled.button`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #e0625e;
  background: rgba(224, 98, 94, 0.08);
  border: 1px solid rgba(224, 98, 94, 0.28);
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.18s ease, border-color 0.18s ease;

  &:hover {
    background: rgba(224, 98, 94, 0.18);
    border-color: rgba(224, 98, 94, 0.5);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Empty = styled.p`
  margin: 0;
  font-size: 13px;
  color: #6b7479;
`;

const Err = styled.p`
  margin: 0;
  font-size: 12px;
  color: #e0625e;
`;

function AdminCommentManager({ articleId, token }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = useCallback(async () => {
    if (!articleId) return;
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`/api/articles/${articleId}/comments`);
      // The endpoint returns ALL comments; scope to this article (same
      // pattern as RightColumn — `blog` is the ObjectId ref).
      const scoped = (res.data?.comments || []).filter(
        (c) => c.blog === articleId
      );
      setComments(scoped);
    } catch (err) {
      setError(err.response?.data?.msg || "Could not load comments.");
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (commentId) => {
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;
    setDeletingId(commentId);
    try {
      await axios.delete(`/api/articles/${articleId}/comments/${commentId}`, {
        headers: { Authorization: token },
      });
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete comment.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Section>
      <Header>
        <Title>Comments</Title>
        <Count>{loading ? "Loading…" : `${comments.length} total`}</Count>
      </Header>

      {error && <Err>{error}</Err>}

      {!loading && !error && comments.length === 0 && (
        <Empty>No comments on this article yet.</Empty>
      )}

      {!loading && comments.length > 0 && (
        <List>
          {comments.map((c) => (
            <Item key={c._id}>
              <Body>
                <Who>
                  <span className="name">{c.name || "Anonymous"}</span>
                  {c.email && <span>{c.email}</span>}
                </Who>
                <Text>{c.comment}</Text>
              </Body>
              <DeleteBtn
                onClick={() => remove(c._id)}
                disabled={deletingId === c._id}
                title="Delete comment"
              >
                <FaTrash size={10} />
                {deletingId === c._id ? "Deleting…" : "Delete"}
              </DeleteBtn>
            </Item>
          ))}
        </List>
      )}
    </Section>
  );
}

export default AdminCommentManager;
