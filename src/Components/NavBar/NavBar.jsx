import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styled, { css } from "styled-components";
import { useCookies } from "react-cookie";
import { GlobalState } from "../../GlobalState";

const LOGO =
  "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/logo-min.png";

/* ------------------------------------------------------------------
   Styled components
------------------------------------------------------------------ */

const Bar = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  transition: background 0.25s ease, border-color 0.25s ease,
    backdrop-filter 0.25s ease;

  ${({ scrolled }) =>
    scrolled
      ? css`
          background: rgba(15, 18, 22, 0.78);
          backdrop-filter: saturate(160%) blur(14px);
          -webkit-backdrop-filter: saturate(160%) blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        `
      : css`
          background: #0f1216;
          backdrop-filter: none;
          border-bottom: 1px solid rgba(255, 255, 255, 0);
        `}
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;

  @media (max-width: 720px) {
    padding: 12px 18px;
  }
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #f4f6f8;
  flex-shrink: 0;

  &:hover {
    color: #f4f6f8;
    text-decoration: none;
  }
`;

const BrandLogo = styled.img`
  height: 40px;
  width: auto;
  display: block;
  object-fit: contain;
`;

const Welcome = styled.span`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  font-family: "Lato", sans-serif;

  .hi {
    color: #6b7479;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
  .name {
    color: #f4f6f8;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
`;

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;

  @media (max-width: 720px) {
    display: none;
  }
`;

const linkBase = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: #a3acb2;
  text-decoration: none;
  border-radius: 8px;
  transition: color 0.15s ease, background 0.15s ease;

  &:hover {
    color: #f4f6f8;
    text-decoration: none;
    background: rgba(255, 255, 255, 0.04);
  }
`;

const NavAnchor = styled(Link)`
  ${linkBase}
  ${({ active }) =>
    active &&
    css`
      color: #ffffff;
      background: rgba(91, 179, 158, 0.1);
      box-shadow: inset 0 0 0 1px rgba(91, 179, 158, 0.28);

      &::before {
        content: "";
        width: 5px;
        height: 5px;
        border-radius: 50%;
        background: #5bb39e;
        box-shadow: 0 0 8px rgba(91, 179, 158, 0.6);
        margin-right: 8px;
        flex-shrink: 0;
      }
    `}
`;

const ExternalAnchor = styled.a`
  ${linkBase}
`;

const PrimaryCTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-left: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  background: #206a5d;
  color: #ffffff;
  font-family: "Lato", sans-serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 14px rgba(32, 106, 93, 0.25);
  transition: background 0.15s ease, transform 0.12s ease,
    box-shadow 0.15s ease;

  &:hover {
    background: #267a6b;
    color: #ffffff;
    text-decoration: none;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(32, 106, 93, 0.35);
  }
`;

const LogoutBtn = styled.button`
  ${linkBase}
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  margin-left: 8px;
  cursor: pointer;

  &:hover {
    border-color: rgba(255, 255, 255, 0.18);
    color: #f4f6f8;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const MobileToggle = styled.button`
  display: none;
  position: relative;
  width: 36px;
  height: 36px;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  cursor: pointer;
  padding: 0;

  span {
    position: absolute;
    left: 9px;
    width: 18px;
    height: 1.5px;
    background: #f4f6f8;
    transition: transform 0.2s ease, opacity 0.2s ease, top 0.2s ease;
  }
  span:nth-child(1) {
    top: 12px;
  }
  span:nth-child(2) {
    top: 17px;
  }
  span:nth-child(3) {
    top: 22px;
  }

  span[data-open="true"]:nth-child(1) {
    top: 17px;
    transform: rotate(45deg);
  }
  span[data-open="true"]:nth-child(2) {
    opacity: 0;
  }
  span[data-open="true"]:nth-child(3) {
    top: 17px;
    transform: rotate(-45deg);
  }

  @media (max-width: 720px) {
    display: block;
  }
`;

const MobileDrawer = styled(motion.div)`
  display: none;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(15, 18, 22, 0.96);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  padding: 12px 18px 18px;

  @media (max-width: 720px) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
`;

const MobileLinkBase = css`
  font-family: "Lato", sans-serif;
  font-size: 15px;
  font-weight: 500;
  color: #d2d8da;
  padding: 12px 12px;
  border-radius: 8px;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    color: #ffffff;
    text-decoration: none;
  }
`;

const MobileLink = styled(Link)`
  ${MobileLinkBase}
  ${({ active }) =>
    active &&
    css`
      color: #5bb39e;
      background: rgba(32, 106, 93, 0.08);
    `}
`;

const MobileExternal = styled.a`
  ${MobileLinkBase}
`;

const MobileLogout = styled.button`
  ${MobileLinkBase}
  margin-top: 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  cursor: pointer;
  font-size: 14px;
`;

/* ------------------------------------------------------------------
   Component
------------------------------------------------------------------ */

const NavBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;
  const [user] = state.userAPI.user;
  const logout = state.userAPI.logout;
  const [, , removeCookie] = useCookies(["cookie-name"]);

  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  // Hide on blog reader / gamecorner — but NOT on /admin/blog/* admin routes.
  // Match `/blog/:id` exactly (one path segment after /blog/).
  const isBlogReader = /^\/blog\/[^/]+/.test(currentPath);
  const isGameCorner = currentPath.includes("gamecorner");
  if (isBlogReader || isGameCorner) {
    return null;
  }

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("firstLogin");
      localStorage.removeItem("isLoggedIn");
      removeCookie("accesstoken");
      removeCookie("refreshtoken");
      window.location.href = "/";
    }
  };

  const publicLinks = [
    { to: "/", label: "Home" },
    { to: "/project", label: "Projects" },
    { to: "/blog", label: "Blog" },
    { to: "/about", label: "About" },
  ];
  
  const loggedInLinks = [
    { to: "/", label: "Home" },
    { to: "/blog", label: "Blog" },
    { to: "/shop", label: "Shop" },
  ];

  const adminLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/blogs", label: "Posts" },
    { to: "/admin/products", label: "Products" },
    { to: "/admin/art", label: "Art" },
    { to: "/admin/users", label: "Users" },
    { to: "/admin/uploads", label: "Uploads" },
  ];

  const isActive = (to) =>
    to === "/" ? currentPath === "/" : currentPath.startsWith(to);

  const visibleLinks = (isLoggedIn ? loggedInLinks : publicLinks).filter(
    (l) => !l.hidden
  );

  return (
    <Bar scrolled={scrolled}>
      <Inner>
        <Brand to={isLoggedIn ? "/" : "/login"} aria-label="HoseaCodes home">
          {isLoggedIn ? (
            <Welcome>
              <span className="hi">Hi,</span>
              <span className="name">
                {user?.name ? user.name.split(" ")[0] : "User"}
              </span>
            </Welcome>
          ) : (
            <BrandLogo src={LOGO} alt="HoseaCodes" />
          )}
        </Brand>

        <DesktopNav aria-label="Primary">
          {visibleLinks.map((l) => (
            <NavAnchor key={l.to} to={l.to} active={isActive(l.to) ? 1 : 0}>
              {l.label}
            </NavAnchor>
          ))}
          {isAdmin &&
            adminLinks.map((l) => (
              <NavAnchor key={l.to} to={l.to} active={isActive(l.to) ? 1 : 0}>
                {l.label}
              </NavAnchor>
            ))}
          {!isLoggedIn && (
            <PrimaryCTA to="/contact">Get in touch</PrimaryCTA>
          )}
          {isLoggedIn && <LogoutBtn onClick={handleLogout}>Logout</LogoutBtn>}
        </DesktopNav>

        <MobileToggle
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span data-open={open} />
          <span data-open={open} />
          <span data-open={open} />
        </MobileToggle>
      </Inner>

      <AnimatePresence initial={false}>
        {open && (
          <MobileDrawer
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {isAdmin &&
              adminLinks.map((l) => (
                <MobileLink
                  key={l.to}
                  to={l.to}
                  active={isActive(l.to) ? 1 : 0}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </MobileLink>
              ))}
            {visibleLinks.map((l) => (
              <MobileLink
                key={l.to}
                to={l.to}
                active={isActive(l.to) ? 1 : 0}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </MobileLink>
            ))}
            <MobileExternal
              href="http://www.dominiquehosea.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
            >
              Backend Portfolio ↗
            </MobileExternal>
            {!isLoggedIn && (
              <MobileLink
                to="/contact"
                active={isActive("/contact") ? 1 : 0}
                onClick={() => setOpen(false)}
              >
                Contact
              </MobileLink>
            )}
            {isLoggedIn && (
              <MobileLogout onClick={handleLogout}>Logout</MobileLogout>
            )}
          </MobileDrawer>
        )}
      </AnimatePresence>
    </Bar>
  );
};

export default NavBar;
