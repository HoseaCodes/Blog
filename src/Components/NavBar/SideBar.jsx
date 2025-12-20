import React, { useContext, useState, useEffect } from "react";
import styled from 'styled-components';
import { Link, useParams } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsHouseDoor, BsBell, BsBellFill } from "react-icons/bs";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import axios from "axios";

// =============================================
// MEDIUM DESIGN TOKENS
// =============================================
const mediumTheme = {
  colors: {
    text: {
      primary: '#242424',
      secondary: '#6b6b6b',
      light: '#8b8b8b'
    },
    background: {
      white: '#ffffff',
      border: '#e6e6e6',
      hover: '#f2f2f2'
    },
    accent: {
      green: '#1a8917'
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px'
  },
  breakpoints: {
    tablet: '1024px'
  }
};

// =============================================
// STYLED COMPONENTS
// =============================================
const StyledLeftContainer = styled.aside`
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
  z-index: 10;
  padding: ${mediumTheme.spacing.lg} 0;
  border-right: 1px solid ${mediumTheme.colors.background.border};
  background: ${mediumTheme.colors.background.white};
  width: 80px;

  @media (max-width: ${mediumTheme.breakpoints.tablet}) {
    display: none;
  }
`;

const JustifyContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: ${mediumTheme.spacing.xl};
`;

const LogoImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const StackedAlign = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${mediumTheme.spacing.lg};
  align-items: center;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${mediumTheme.spacing.sm};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${mediumTheme.colors.text.secondary};
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${mediumTheme.colors.background.hover};
    color: ${mediumTheme.colors.text.primary};
    transform: scale(1.1);
  }

  &.active {
    color: ${mediumTheme.colors.accent.green};
    
    &::after {
      content: '';
      position: absolute;
      right: -2px;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 20px;
      background-color: ${mediumTheme.colors.accent.green};
      border-radius: 2px;
    }
  }

  &:focus {
    outline: 2px solid ${mediumTheme.colors.accent.green};
    outline-offset: 2px;
  }

  svg {
    font-size: 20px;
  }
`;

const ActionDivider = styled.hr`
  width: 24px;
  height: 1px;
  background-color: ${mediumTheme.colors.background.border};
  border: none;
  margin: ${mediumTheme.spacing.sm} 0;
`;

const TooltipWrapper = styled.div`
  position: relative;

  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateY(-50%) translateX(5px);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  left: 50px;
  top: 50%;
  transform: translateY(-50%) translateX(0);
  background: ${mediumTheme.colors.text.primary};
  color: ${mediumTheme.colors.background.white};
  padding: ${mediumTheme.spacing.xs} ${mediumTheme.spacing.sm};
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;
  z-index: 1000;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    border: 5px solid transparent;
    border-right-color: ${mediumTheme.colors.text.primary};
  }
`;

// =============================================
// MAIN COMPONENT
// =============================================
const SideBar = ({ user, article }) => {
  const logo = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/newLogo.png";
  const [savedArticleState, setSavedArticleState] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const param = useParams();
  const state = useContext(GlobalState);
  const [isAdmin] = state.userAPI.isAdmin;

  // Initialize states based on user data
  useEffect(() => {
    if (user && article) {
      setSavedArticleState(user.savedArticles?.includes(article._id) || false);
      setNotifications(user.notifications?.includes(article._id) || false);
    }
  }, [user, article]);

  const handleUnauthorized = (e) => {
    e.preventDefault();
    alert(
      "You are not authorized to make a post. If you create an account you can begin making posts."
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!user || !article) {
      alert("Please log in to save articles.");
      return;
    }

    try {
      await axios.put(`/api/user/${user._id}`, {
        savedArticles: [article._id],
      });
      setSavedArticleState(!savedArticleState);
      
      // Show success feedback
      const action = savedArticleState ? 'removed from' : 'saved to';
      alert(`Article ${action} your reading list!`);
    } catch (err) {
      console.error('Error saving article:', err);
      alert('Failed to save article. Please try again.');
    }
  };

  const handleNotification = async (e) => {
    e.preventDefault();
    
    if (!user || !article) {
      alert("Please log in to manage notifications.");
      return;
    }

    try {
      await axios.put(`/api/user/${user._id}`, {
        notifications: [article._id],
      });
      setNotifications(!notifications);
      
      // Show success feedback
      const action = notifications ? 'disabled' : 'enabled';
      alert(`Notifications ${action} for this author!`);
    } catch (err) {
      console.error('Error updating notifications:', err);
      alert('Failed to update notifications. Please try again.');
    }
  };

  return (
    <StyledLeftContainer>
      <JustifyContent>
        <TooltipWrapper>
          <Link to="/">
            <LogoImage src={logo} alt="Medium Logo" />
          </Link>
          <Tooltip className="tooltip">Home</Tooltip>
        </TooltipWrapper>
      </JustifyContent>
      
      <StackedAlign>
        <TooltipWrapper>
          <Link to="/">
            <ActionButton aria-label="Home">
              <BsHouseDoor />
            </ActionButton>
          </Link>
          <Tooltip className="tooltip">Home</Tooltip>
        </TooltipWrapper>

        <TooltipWrapper>
          <ActionButton 
            className={notifications ? 'active' : ''}
            onClick={handleNotification}
            aria-label={notifications ? 'Disable notifications' : 'Enable notifications'}
          >
            {notifications ? <BsBellFill /> : <BsBell />}
          </ActionButton>
          <Tooltip className="tooltip">
            {notifications ? 'Notifications on' : 'Get notifications'}
          </Tooltip>
        </TooltipWrapper>

        <TooltipWrapper>
          <ActionButton 
            className={savedArticleState ? 'active' : ''}
            onClick={handleSave}
            aria-label={savedArticleState ? 'Remove bookmark' : 'Save article'}
          >
            {savedArticleState ? <MdBookmark /> : <MdBookmarkBorder />}
          </ActionButton>
          <Tooltip className="tooltip">
            {savedArticleState ? 'Saved' : 'Save article'}
          </Tooltip>
        </TooltipWrapper>

        <ActionDivider />

        <TooltipWrapper>
          {isAdmin ? (
            <Link to="/admin/blog/new">
              <ActionButton aria-label="Write a story">
                <HiOutlinePencilAlt />
              </ActionButton>
            </Link>
          ) : (
            <ActionButton 
              onClick={handleUnauthorized}
              aria-label="Write a story"
            >
              <HiOutlinePencilAlt />
            </ActionButton>
          )}
          <Tooltip className="tooltip">Write</Tooltip>
        </TooltipWrapper>
      </StackedAlign>
    </StyledLeftContainer>
  );
};

export default SideBar;