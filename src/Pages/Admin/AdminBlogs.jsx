import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { GlobalState } from "../../GlobalState";
import { truncate } from "../../Utils/helperFunctions";
import {
  FiPlus,
  FiEdit2,
  FiArchive,
  FiTrash2,
  FiFileText,
  FiHeart,
  FiMessageSquare,
  FiSearch,
  FiArrowLeft,
} from "react-icons/fi";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop";

const POSTS_PER_PAGE = 8;

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Page = styled.section`
  background: #0f1216;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 96px 24px 56px;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    background: radial-gradient(
      55% 50% at 50% 0%,
      rgba(32, 106, 93, 0.16),
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255, 255, 255, 0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255, 255, 255, 0.025) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(
      ellipse 70% 60% at 50% 30%,
      #000 30%,
      transparent 100%
    );
    -webkit-mask-image: radial-gradient(
      ellipse 70% 60% at 50% 30%,
      #000 30%,
      transparent 100%
    );
    pointer-events: none;
    z-index: 0;
  }

  @media (max-width: 720px) {
    padding: 64px 18px 40px;
  }
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: #6b7479;
  text-decoration: none;
  margin-bottom: 20px;
  transition: color 0.15s ease;

  &:hover {
    color: #d2d8da;
    text-decoration: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
  margin-bottom: 32px;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Kicker = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #5bb39e;

  &::before {
    content: "";
    width: 24px;
    height: 1px;
    background: #5bb39e;
    opacity: 0.6;
  }
`;

const Heading = styled.h1`
  font-weight: 800;
  font-size: clamp(32px, 4.4vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.022em;
  color: #f4f6f8;
  margin: 0;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const Tagline = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: #a3acb2;
  margin: 0;
`;

const NewPostBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 10px;
  background: #206a5d;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 22px rgba(32, 106, 93, 0.28);
  transition: background 0.18s ease, transform 0.12s ease,
    box-shadow 0.18s ease;

  &:hover {
    background: #267a6b;
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: 0 10px 26px rgba(32, 106, 93, 0.4);
  }
`;

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;

  @media (max-width: 720px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatCard = styled.div`
  padding: 18px 20px;
  border-radius: 12px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #6b7479;
  }
  .value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #f4f6f8;
    line-height: 1;
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 24px;
`;

const SearchWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 240px;
  max-width: 420px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7479;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 11px 14px 11px 38px;
  border-radius: 10px;
  background: rgba(15, 18, 22, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  font-size: 14px;
  outline: none;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;

  &::placeholder {
    color: #6b7479;
  }
  &:focus {
    border-color: rgba(91, 179, 158, 0.45);
    box-shadow: 0 0 0 3px rgba(91, 179, 158, 0.15);
  }
`;

const FilterChips = styled.div`
  display: inline-flex;
  gap: 6px;
`;

const Chip = styled.button`
  padding: 9px 14px;
  border-radius: 999px;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid
    ${({ active }) =>
      active ? "rgba(91, 179, 158, 0.4)" : "rgba(255, 255, 255, 0.08)"};
  background: ${({ active }) =>
    active ? "rgba(91, 179, 158, 0.12)" : "rgba(255, 255, 255, 0.02)"};
  color: ${({ active }) => (active ? "#5bb39e" : "#a3acb2")};
  transition: all 0.15s ease;

  &:hover {
    color: #f4f6f8;
    border-color: rgba(255, 255, 255, 0.18);
  }
`;

const Grid = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px 120px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;

  @media (max-width: 720px) {
    padding: 0 18px 80px;
  }
`;

const ArticleCard = styled.article`
  display: grid;
  grid-template-columns: 200px 1fr auto;
  gap: 24px;
  padding: 20px;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  transition: border-color 0.22s ease, background 0.22s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.2);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
  }

  @media (max-width: 900px) {
    grid-template-columns: 160px 1fr;
  }
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const ArticleImage = styled.div`
  width: 100%;
  aspect-ratio: 4 / 3;
  border-radius: 10px;
  overflow: hidden;
  background: #14191e center / cover no-repeat;
  background-image: url(${({ bg }) => bg || FALLBACK_IMG});
`;

const ArticleBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

const StatusRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;

  ${({ tone }) =>
    tone === "draft"
      ? `background: rgba(234, 179, 8, 0.1); color: #fcd34d; border: 1px solid rgba(234, 179, 8, 0.3);`
      : tone === "archived"
      ? `background: rgba(248, 113, 113, 0.08); color: #f8b4b4; border: 1px solid rgba(248, 113, 113, 0.28);`
      : `background: rgba(91, 179, 158, 0.1); color: #5bb39e; border: 1px solid rgba(91, 179, 158, 0.28);`}
`;

const CategoryPill = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 11px;
  font-weight: 500;
  color: #c5cbcf;
  letter-spacing: 0.04em;
`;

const ArticleTitle = styled(Link)`
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.012em;
  line-height: 1.3;
  color: #f4f6f8;
  margin: 0;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #5bb39e;
    text-decoration: none;
  }
`;

const ArticleExcerpt = styled.p`
  font-size: 13px;
  line-height: 1.55;
  color: #a3acb2;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  padding-top: 8px;
  font-size: 12px;
  color: #6b7479;

  span {
    display: inline-flex;
    align-items: center;
    gap: 5px;
  }
  svg {
    color: #4d5559;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  @media (max-width: 900px) {
    flex-direction: row;
    grid-column: 1 / -1;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 12px;
    margin-top: 4px;
    flex-wrap: wrap;
  }
`;

const IconBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
  min-width: 110px;
  justify-content: flex-start;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    border-color: ${({ tone }) =>
      tone === "danger"
        ? "rgba(248, 113, 113, 0.35)"
        : "rgba(91, 179, 158, 0.3)"};
  }

  ${({ active, tone }) =>
    active &&
    `
    background: ${
      tone === "danger"
        ? "rgba(248, 113, 113, 0.1)"
        : "rgba(234, 179, 8, 0.1)"
    };
    color: ${tone === "danger" ? "#f8b4b4" : "#fcd34d"};
    border-color: ${
      tone === "danger"
        ? "rgba(248, 113, 113, 0.3)"
        : "rgba(234, 179, 8, 0.3)"
    };
  `}
`;

const EmptyState = styled.div`
  padding: 64px 24px;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: #6b7479;
  font-size: 14px;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 28px;
`;

const PageBtn = styled.button`
  min-width: 36px;
  height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  background: ${({ active }) =>
    active ? "rgba(91, 179, 158, 0.12)" : "rgba(255, 255, 255, 0.02)"};
  color: ${({ active }) => (active ? "#5bb39e" : "#a3acb2")};
  border: 1px solid
    ${({ active }) =>
      active ? "rgba(91, 179, 158, 0.4)" : "rgba(255, 255, 255, 0.08)"};
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover:not(:disabled) {
    color: #f4f6f8;
    border-color: rgba(255, 255, 255, 0.18);
  }
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.div`
  margin-left: 12px;
  font-size: 12px;
  color: #6b7479;
`;

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const AdminBlogs = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [user] = state.userAPI.user;
  const [articles] = state.articlesAPI.articles;
  const [callback, setCallback] = state.articlesAPI.callback;

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    if (!window.confirm("Delete this article? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/articles/${id}`, {
        headers: { Authorization: token },
      });
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete article");
    }
  };

  const handleArchive = async (e, id, archived) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/articles/${id}`,
        { archived: !archived },
        { headers: { Authorization: token } }
      );
      setCallback(!callback);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update article");
    }
  };

  const handleDraft = async (e, id, draft) => {
    e.preventDefault();
    try {
      await axios.put(
        `/api/articles/${id}`,
        { draft: !draft },
        { headers: { Authorization: token } }
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update article");
    }
  };

  const allArticles = useMemo(
    () =>
      [...(articles || [])].sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      ),
    [articles]
  );

  const counts = useMemo(() => {
    const total = allArticles.length;
    let published = 0;
    let draft = 0;
    let archived = 0;
    allArticles.forEach((a) => {
      if (a.archived) archived++;
      else if (a.draft) draft++;
      else published++;
    });
    return { total, published, draft, archived };
  }, [allArticles]);

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allArticles.filter((a) => {
      if (filter === "published" && (a.draft || a.archived)) return false;
      if (filter === "draft" && !a.draft) return false;
      if (filter === "archived" && !a.archived) return false;
      if (q) {
        const hay = `${a.title || ""} ${a.description || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allArticles, filter, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / POSTS_PER_PAGE)
  );

  const pagedArticles = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredArticles.slice(start, start + POSTS_PER_PAGE);
  }, [filteredArticles, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const grid = document.getElementById("admin-blogs-grid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxToShow = 5;
    let start = Math.max(1, currentPage - Math.floor(maxToShow / 2));
    let end = Math.min(totalPages, start + maxToShow - 1);
    if (end - start + 1 < maxToShow) {
      start = Math.max(1, end - maxToShow + 1);
    }
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <Page>
      <HeroSection>
        <Shell>
          <BackLink to="/admin">
            <FiArrowLeft size={12} />
            Admin overview
          </BackLink>
          <Header>
            <TitleBlock>
              <Kicker>Admin · Posts</Kicker>
              <Heading>
                All <em>blog posts</em>.
              </Heading>
              <Tagline>
                Hi {firstName} — manage drafts, archives, and published content
                from one place.
              </Tagline>
            </TitleBlock>
            <NewPostBtn to="/admin/blog/new">
              <FiPlus size={16} />
              New post
            </NewPostBtn>
          </Header>

          <StatsRow>
            <StatCard>
              <span className="label">Total</span>
              <span className="value">{counts.total}</span>
            </StatCard>
            <StatCard>
              <span className="label">Published</span>
              <span className="value">{counts.published}</span>
            </StatCard>
            <StatCard>
              <span className="label">Drafts</span>
              <span className="value">{counts.draft}</span>
            </StatCard>
            <StatCard>
              <span className="label">Archived</span>
              <span className="value">{counts.archived}</span>
            </StatCard>
          </StatsRow>

          <ToolbarRow>
            <SearchWrap>
              <FiSearch size={14} />
              <SearchInput
                type="search"
                placeholder="Search by title or description"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrap>
            <FilterChips>
              {[
                { k: "all", label: "All" },
                { k: "published", label: "Published" },
                { k: "draft", label: "Drafts" },
                { k: "archived", label: "Archived" },
              ].map((f) => (
                <Chip
                  key={f.k}
                  active={filter === f.k}
                  onClick={() => setFilter(f.k)}
                >
                  {f.label}
                </Chip>
              ))}
            </FilterChips>
          </ToolbarRow>
        </Shell>
      </HeroSection>

      <Grid id="admin-blogs-grid">
        {filteredArticles.length === 0 ? (
          <EmptyState>
            {allArticles.length === 0
              ? "No articles yet. Click \"New post\" to write your first one."
              : "No articles match the current filter."}
          </EmptyState>
        ) : (
          pagedArticles.map((article) => {
            const status = article.archived
              ? "archived"
              : article.draft
              ? "draft"
              : "published";
            const statusLabel =
              status === "archived"
                ? "Archived"
                : status === "draft"
                ? "Draft"
                : "Published";
            const image =
              article.images?.url || article.image || FALLBACK_IMG;
            const category =
              Array.isArray(article.categories) && article.categories[0]
                ? article.categories[0]
                : null;
            return (
              <ArticleCard key={article._id}>
                <ArticleImage bg={image} />
                <ArticleBody>
                  <StatusRow>
                    <StatusPill tone={status}>{statusLabel}</StatusPill>
                    {category && <CategoryPill>{category}</CategoryPill>}
                  </StatusRow>
                  <ArticleTitle to={`/blog/${article._id}`}>
                    {article.title || "Untitled"}
                  </ArticleTitle>
                  <ArticleExcerpt>
                    {truncate(article.description || "")}
                  </ArticleExcerpt>
                  <Meta>
                    <span>
                      <FiFileText size={11} />
                      {formatDate(article.createdAt)}
                    </span>
                    <span>
                      <FiHeart size={11} />
                      {article.likes || 0}
                    </span>
                    <span>
                      <FiMessageSquare size={11} />
                      {Array.isArray(article.comments)
                        ? article.comments.length
                        : 0}
                    </span>
                  </Meta>
                </ArticleBody>
                <Actions>
                  <IconBtn as={Link} to={`/admin/blog/edit/${article._id}`}>
                    <FiEdit2 size={12} />
                    Edit
                  </IconBtn>
                  <IconBtn
                    active={article.draft}
                    onClick={(e) => handleDraft(e, article._id, article.draft)}
                  >
                    <FiFileText size={12} />
                    {article.draft ? "Unpublish" : "Draft"}
                  </IconBtn>
                  <IconBtn
                    active={article.archived}
                    onClick={(e) =>
                      handleArchive(e, article._id, article.archived)
                    }
                  >
                    <FiArchive size={12} />
                    {article.archived ? "Unarchive" : "Archive"}
                  </IconBtn>
                  <IconBtn
                    tone="danger"
                    onClick={(e) => handleDelete(e, article._id)}
                  >
                    <FiTrash2 size={12} />
                    Delete
                  </IconBtn>
                </Actions>
              </ArticleCard>
            );
          })
        )}

        {filteredArticles.length > POSTS_PER_PAGE && (
          <Pagination>
            <PageBtn
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ←
            </PageBtn>
            {getPageNumbers().map((p) => (
              <PageBtn
                key={p}
                active={currentPage === p}
                onClick={() => handlePageChange(p)}
              >
                {p}
              </PageBtn>
            ))}
            <PageBtn
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              →
            </PageBtn>
            <PageInfo>
              Page {currentPage} of {totalPages}
            </PageInfo>
          </Pagination>
        )}
      </Grid>
    </Page>
  );
};

export default AdminBlogs;
