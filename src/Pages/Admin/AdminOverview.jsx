import React, { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { GlobalState } from "../../GlobalState";
import {
  FiFileText,
  FiUsers,
  FiUpload,
  FiPlus,
  FiShoppingBag,
  FiZap,
  FiGift,
} from "react-icons/fi";

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
  padding: 120px 24px 56px;
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
    padding: 80px 18px 40px;
  }
`;

const Shell = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 14px;

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
  font-size: clamp(36px, 5.5vw, 56px);
  line-height: 1.04;
  letter-spacing: -0.028em;
  color: #f4f6f8;
  margin: 0 0 12px;

  em {
    font-style: normal;
    color: #5bb39e;
  }
`;

const Tagline = styled.p`
  font-size: clamp(15px, 1.4vw, 17px);
  line-height: 1.55;
  color: #a3acb2;
  margin: 0;
  max-width: 560px;
`;

const Grid = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 24px 120px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;

  @media (max-width: 720px) {
    padding: 8px 18px 80px;
  }
`;

const Tile = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 28px;
  border-radius: 16px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0%,
    rgba(255, 255, 255, 0.008) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.06);
  text-decoration: none;
  color: inherit;
  min-height: 200px;
  overflow: hidden;
  transition: border-color 0.22s ease, transform 0.22s ease,
    background 0.22s ease;

  &::after {
    content: "→";
    position: absolute;
    top: 22px;
    right: 24px;
    font-size: 18px;
    color: #5bb39e;
    opacity: 0;
    transform: translate(-8px, 0);
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  &:hover {
    border-color: rgba(91, 179, 158, 0.28);
    transform: translateY(-4px);
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(255, 255, 255, 0.012) 100%
    );
    text-decoration: none;
    color: inherit;
  }
  &:hover::after {
    opacity: 1;
    transform: translate(0, 0);
  }
`;

const IconWrap = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(91, 179, 158, 0.1);
  border: 1px solid rgba(91, 179, 158, 0.22);
  color: #5bb39e;
  font-size: 20px;
`;

const TileTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.015em;
  color: #f4f6f8;
  margin: 0;
`;

const TileDesc = styled.p`
  font-size: 13px;
  line-height: 1.55;
  color: #a3acb2;
  margin: 0;
`;

const TileFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6b7479;

  .count {
    color: #5bb39e;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: none;
  }
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const AdminOverview = () => {
  const state = useContext(GlobalState);
  const [user] = state.userAPI.user;
  const [articles] = state.articlesAPI.articles;
  const [products] = state.productsAPI.products;

  const articleCounts = useMemo(() => {
    const total = (articles || []).length;
    let drafts = 0;
    let archived = 0;
    let published = 0;
    (articles || []).forEach((a) => {
      if (a.archive) archived++;
      else if (a.draft) drafts++;
      else published++;
    });
    return { total, drafts, archived, published };
  }, [articles]);

  const productCounts = useMemo(() => {
    const all = products || [];
    const physical = all.filter((p) => p.type !== "ai-art").length;
    const art = all.filter((p) => p.type === "ai-art").length;
    return { physical, art };
  }, [products]);

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  const tiles = [
    {
      to: "/admin/blogs",
      icon: <FiFileText />,
      title: "Posts",
      desc: "Manage drafts, archives, and published articles.",
      footer: `${articleCounts.total} total`,
      meta: `${articleCounts.published} live · ${articleCounts.drafts} drafts`,
    },
    {
      to: "/admin/blog/new",
      icon: <FiPlus />,
      title: "New post",
      desc: "Open the editor and start a new article from scratch.",
      footer: "Editor",
      meta: "Markdown",
    },
    {
      to: "/admin/products",
      icon: <FiShoppingBag />,
      title: "Products",
      desc: "Manage shop inventory — price, stock, and listings.",
      footer: "Shop",
      meta: `${productCounts.physical} listed`,
    },
    {
      to: "/admin/art",
      icon: <FiZap />,
      title: "AI Art",
      desc: "Browse and moderate generated DALL-E + Stability pieces.",
      footer: "Catalog",
      meta: `${productCounts.art} pieces`,
    },
    {
      to: "/admin/users",
      icon: <FiUsers />,
      title: "Users",
      desc: "View accounts, roles, and access — block or promote.",
      footer: "User management",
      meta: null,
    },
    {
      to: "/admin/uploads",
      icon: <FiUpload />,
      title: "Uploads",
      desc: "Media library — images and assets across the platform.",
      footer: "Storage",
      meta: null,
    },
    {
      to: "/shop/redeem",
      icon: <FiGift />,
      title: "Redeem store",
      desc: "Point-priced items players can redeem for game points.",
      footer: "Storefront",
      meta: "View store",
    },
  ];

  return (
    <Page>
      <HeroSection>
        <Shell>
          <Kicker>Admin</Kicker>
          <Heading>
            Hi {firstName} — what are we <em>shipping</em>?
          </Heading>
          <Tagline>
            Pick an area to manage. Everything you touch from here writes back
            to production.
          </Tagline>
        </Shell>
      </HeroSection>

      <Grid>
        {tiles.map((tile) => (
          <Tile key={tile.to} to={tile.to}>
            <IconWrap>{tile.icon}</IconWrap>
            <div>
              <TileTitle>{tile.title}</TileTitle>
              <TileDesc style={{ marginTop: 6 }}>{tile.desc}</TileDesc>
            </div>
            <TileFooter>
              <span>{tile.footer}</span>
              {tile.meta && (
                <span className="count" style={{ marginLeft: "auto" }}>
                  {tile.meta}
                </span>
              )}
            </TileFooter>
          </Tile>
        ))}
      </Grid>
    </Page>
  );
};

export default AdminOverview;
