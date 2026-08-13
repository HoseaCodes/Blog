import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import {
  FiPlus,
  FiTrash2,
  FiSearch,
  FiArrowLeft,
  FiZap,
  FiExternalLink,
  FiCopy,
} from "react-icons/fi";
import { GlobalState } from "../../GlobalState";

const POSTS_PER_PAGE = 12;

/* ------------------------------------------------------------------
   Styled components (shared vocabulary with AdminProducts)
------------------------------------------------------------------ */

const Page = styled.section`
  background: #0f1216;
  color: #f4f6f8;
  font-family: "Lato", sans-serif;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  position: relative;
  padding: 96px 24px 48px;
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
    padding: 64px 18px 32px;
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
  margin-bottom: 28px;
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
`;

const Tagline = styled.p`
  font-size: 15px;
  line-height: 1.5;
  color: #a3acb2;
  margin: 0;
`;

const NewBtn = styled(Link)`
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
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
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
    font-size: 24px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: #f4f6f8;
    line-height: 1;
  }
`;

const ToolbarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
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
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    padding: 0 18px 80px;
  }
`;

const ArtCard = styled.article`
  display: flex;
  flex-direction: column;
  border-radius: 14px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  overflow: hidden;
  transition: border-color 0.22s ease, transform 0.22s ease,
    background 0.22s ease;

  &:hover {
    border-color: rgba(91, 179, 158, 0.22);
    transform: translateY(-2px);
  }
`;

const ArtImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background: #14191e center / cover no-repeat;
  background-image: url(${({ bg }) => bg});
`;

const ProviderBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 18, 22, 0.7);
  border: 1px solid rgba(91, 179, 158, 0.3);
  backdrop-filter: blur(8px);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #5bb39e;

  svg {
    color: #5bb39e;
  }
`;

const PriceBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 18, 22, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  font-size: 12px;
  font-weight: 700;
  color: #f4f6f8;
  letter-spacing: -0.01em;
`;

const Body = styled.div`
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`;

const Prompt = styled.p`
  font-size: 13px;
  line-height: 1.45;
  color: #d2d8da;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-style: italic;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  color: #6b7479;
  padding-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  padding: 0 16px 14px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  flex: 1;
  padding: 7px 10px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-size: 11px;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
    border-color: ${({ tone }) =>
      tone === "danger"
        ? "rgba(248, 113, 113, 0.35)"
        : "rgba(91, 179, 158, 0.3)"};
  }
`;

const EmptyState = styled.div`
  grid-column: 1 / -1;
  padding: 64px 24px;
  text-align: center;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  color: #6b7479;
  font-size: 14px;
`;

const Pagination = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
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

const formatPrice = (price) => {
  if (price === undefined || price === null) return "—";
  return `$${Number(price).toFixed(2)}`;
};

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const AdminArt = () => {
  const state = useContext(GlobalState);
  const [products] = state.productsAPI.products;
  const [callback, setCallback] = state.productsAPI.callback || [false, () => {}];
  const [token] = state.token;

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter to AI-art products only
  const artProducts = useMemo(
    () => (products || []).filter((p) => p.type === "ai-art"),
    [products]
  );

  const counts = useMemo(() => {
    const total = artProducts.length;
    const sold = artProducts.reduce((sum, p) => sum + (p.sold || 0), 0);
    const providers = new Set(
      artProducts.map((p) => p.category || "unknown")
    );
    return { total, sold, providers: providers.size };
  }, [artProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return artProducts.filter((p) => {
      if (filter === "dalle" && (p.category || "").toLowerCase() !== "dalle")
        return false;
      if (
        filter === "stability" &&
        (p.category || "").toLowerCase() !== "stability"
      )
        return false;
      if (q) {
        const hay = `${p.title || ""} ${p.description || ""} ${
          p.content || ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [artProducts, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const paged = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filtered.slice(start, start + POSTS_PER_PAGE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, search]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this art? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      if (setCallback) setCallback(!callback);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete art");
    }
  };

  const copyPrompt = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // noop
    }
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
              <Kicker>Admin · AI Art</Kicker>
              <Heading>Generated art catalog.</Heading>
              <Tagline>
                Every preview and purchase-ready piece generated through
                DALL-E and Stability.
              </Tagline>
            </TitleBlock>
            <NewBtn to="/shop/create-art">
              <FiPlus size={16} />
              Generate
            </NewBtn>
          </Header>

          <StatsRow>
            <StatCard>
              <span className="label">Total pieces</span>
              <span className="value">{counts.total}</span>
            </StatCard>
            <StatCard>
              <span className="label">Copies sold</span>
              <span className="value">{counts.sold}</span>
            </StatCard>
            <StatCard>
              <span className="label">Providers</span>
              <span className="value">{counts.providers}</span>
            </StatCard>
          </StatsRow>

          <ToolbarRow>
            <SearchWrap>
              <FiSearch size={14} />
              <SearchInput
                type="search"
                placeholder="Search by title, prompt, or provider"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrap>
            <FilterChips>
              {[
                { k: "all", label: "All" },
                { k: "dalle", label: "DALL-E" },
                { k: "stability", label: "Stability" },
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

      <Grid>
        {filtered.length === 0 ? (
          <EmptyState>
            {artProducts.length === 0
              ? "No AI art yet. Click \"Generate\" to create your first piece."
              : "No pieces match your filter."}
          </EmptyState>
        ) : (
          paged.map((art) => {
            const prompt = art.content || art.description || "—";
            const provider = art.category || "unknown";
            return (
              <ArtCard key={art._id}>
                <ArtImage bg={art.images?.url || ""}>
                  <ProviderBadge>
                    <FiZap size={10} />
                    {provider}
                  </ProviderBadge>
                  <PriceBadge>{formatPrice(art.price)}</PriceBadge>
                </ArtImage>
                <Body>
                  <Prompt title={prompt}>"{prompt}"</Prompt>
                  <Meta>
                    <span>{art.sold || 0} sold</span>
                    {art.images?.url && (
                      <span>
                        <a
                          href={art.images.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: "#5bb39e", textDecoration: "none" }}
                        >
                          View original
                        </a>
                      </span>
                    )}
                  </Meta>
                </Body>
                <Actions>
                  <ActionBtn onClick={() => copyPrompt(prompt)}>
                    <FiCopy size={11} />
                    Copy prompt
                  </ActionBtn>
                  {art.images?.url && (
                    <ActionBtn
                      as="a"
                      href={art.images.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiExternalLink size={11} />
                      Open
                    </ActionBtn>
                  )}
                  <ActionBtn tone="danger" onClick={() => handleDelete(art._id)}>
                    <FiTrash2 size={11} />
                    Delete
                  </ActionBtn>
                </Actions>
              </ArtCard>
            );
          })
        )}

        {filtered.length > POSTS_PER_PAGE && (
          <Pagination>
            <PageBtn
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              ←
            </PageBtn>
            {getPageNumbers().map((p) => (
              <PageBtn
                key={p}
                active={currentPage === p}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </PageBtn>
            ))}
            <PageBtn
              onClick={() => setCurrentPage((p) => p + 1)}
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

export default AdminArt;
