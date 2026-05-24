import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiArrowLeft,
  FiShoppingBag,
} from "react-icons/fi";
import { GlobalState } from "../../GlobalState";

const POSTS_PER_PAGE = 12;

/* ------------------------------------------------------------------
   Styled components — match the rest of the admin family
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
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;

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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    padding: 0 18px 80px;
  }
`;

const ProductCard = styled.article`
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
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.035) 0%,
      rgba(255, 255, 255, 0.012) 100%
    );
  }
`;

const ProductImage = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 3;
  background: #14191e center / cover no-repeat;
  background-image: url(${({ bg }) => bg});
`;

const SoldOutBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(248, 113, 113, 0.15);
  border: 1px solid rgba(248, 113, 113, 0.3);
  backdrop-filter: blur(8px);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #f8b4b4;
`;

const TypeBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(15, 18, 22, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d2d8da;
`;

const Body = styled.div`
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
`;

const Category = styled.span`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #5bb39e;
`;

const Title = styled.h3`
  font-size: 15px;
  font-weight: 700;
  letter-spacing: -0.012em;
  line-height: 1.3;
  color: #f4f6f8;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Description = styled.p`
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
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 12px;
  color: #6b7479;

  .price {
    font-size: 16px;
    font-weight: 700;
    color: #f4f6f8;
    letter-spacing: -0.01em;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  padding: 0 18px 16px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 1;
  padding: 8px 12px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  color: #d2d8da;
  font-size: 12px;
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

const AdminProducts = () => {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [callback, setCallback] = state.productsAPI.callback || [false, () => {}];
  const [token] = state.token;

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter to physical products only (AI art has its own page)
  const physicalProducts = useMemo(
    () => (products || []).filter((p) => p.type !== "ai-art"),
    [products]
  );

  const counts = useMemo(() => {
    const total = physicalProducts.length;
    let inStock = 0;
    let soldOut = 0;
    let unchecked = 0;
    physicalProducts.forEach((p) => {
      if (p.quantity === undefined || p.quantity > 0) inStock++;
      else soldOut++;
      if (!p.checked) unchecked++;
    });
    return { total, inStock, soldOut, unchecked };
  }, [physicalProducts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return physicalProducts.filter((p) => {
      if (filter === "in-stock" && p.quantity !== undefined && p.quantity <= 0)
        return false;
      if (filter === "sold-out" && (p.quantity === undefined || p.quantity > 0))
        return false;
      if (filter === "unchecked" && p.checked) return false;
      if (q) {
        const hay = `${p.title || ""} ${p.description || ""} ${
          p.category || ""
        }`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [physicalProducts, filter, search]);

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
    if (!window.confirm("Delete this product? This cannot be undone.")) return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      if (setCallback) setCallback(!callback);
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to delete product");
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
              <Kicker>Admin · Products</Kicker>
              <Heading>Shop inventory.</Heading>
              <Tagline>
                Manage physical products — pricing, stock, and listings.
              </Tagline>
            </TitleBlock>
            <NewBtn to="/admin/shop/create_product">
              <FiPlus size={16} />
              New product
            </NewBtn>
          </Header>

          <StatsRow>
            <StatCard>
              <span className="label">Total</span>
              <span className="value">{counts.total}</span>
            </StatCard>
            <StatCard>
              <span className="label">In stock</span>
              <span className="value">{counts.inStock}</span>
            </StatCard>
            <StatCard>
              <span className="label">Sold out</span>
              <span className="value">{counts.soldOut}</span>
            </StatCard>
            <StatCard>
              <span className="label">Unreviewed</span>
              <span className="value">{counts.unchecked}</span>
            </StatCard>
          </StatsRow>

          <ToolbarRow>
            <SearchWrap>
              <FiSearch size={14} />
              <SearchInput
                type="search"
                placeholder="Search by title, description, or category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </SearchWrap>
            <FilterChips>
              {[
                { k: "all", label: "All" },
                { k: "in-stock", label: "In stock" },
                { k: "sold-out", label: "Sold out" },
                { k: "unchecked", label: "Unreviewed" },
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
            {physicalProducts.length === 0
              ? "No products yet. Click \"New product\" to add one."
              : "No products match your filter."}
          </EmptyState>
        ) : (
          paged.map((product) => {
            const isSoldOut =
              product.quantity !== undefined && product.quantity <= 0;
            return (
              <ProductCard key={product._id}>
                <ProductImage bg={product.images?.url || ""}>
                  <TypeBadge>
                    <FiShoppingBag
                      size={10}
                      style={{ marginRight: 4, verticalAlign: "middle" }}
                    />
                    {product.type || "physical"}
                  </TypeBadge>
                  {isSoldOut && <SoldOutBadge>Sold out</SoldOutBadge>}
                </ProductImage>
                <Body>
                  {product.category && <Category>{product.category}</Category>}
                  <Title>{product.title || "Untitled"}</Title>
                  <Description>{product.description || ""}</Description>
                  <Meta>
                    <span className="price">{formatPrice(product.price)}</span>
                    <span>
                      {product.quantity !== undefined
                        ? `${product.quantity} in stock`
                        : `${product.sold || 0} sold`}
                    </span>
                  </Meta>
                </Body>
                <Actions>
                  <ActionBtn
                    as={Link}
                    to={`/admin/shop/edit_product/${product._id}`}
                  >
                    <FiEdit2 size={11} />
                    Edit
                  </ActionBtn>
                  <ActionBtn
                    tone="danger"
                    onClick={() => handleDelete(product._id)}
                  >
                    <FiTrash2 size={11} />
                    Delete
                  </ActionBtn>
                </Actions>
              </ProductCard>
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

export default AdminProducts;
