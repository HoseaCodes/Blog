import React, { useContext, useEffect, useState } from "react";
import {
  StyledLeftContainer,
  JustifyContent,
} from "../../Layout/Container/styledArticle";
import { LogoImage } from "../../Layout/Image/styledImage";
import { StackedAlignn } from "../../Layout/Icon/styledIcons";
import { ArticleHr } from "../../Layout/Hr/styledHr";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { BsHouseDoor, BsBell, BsBellFill } from "react-icons/bs";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { Link } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { useParams } from "react-router-dom";
import axios from "axios";

const SideBar = (props) => {
  const logo =
    "https://hoseacodes-blog.s3.amazonaws.com/Assets/Images/newLogo.png";
  const [savedArticleState, setSavedArticleState] = useState(
    props.user.savedArticles.includes(props.article._id)
  );
  const [notifications, setNotifications] = useState(
    props.user.notifications.includes(props.article._id)
  );
  const param = useParams();
  const state = useContext(GlobalState);

  const [isAdmin] = state.userAPI.isAdmin;

  const handleUnauthorized = async (e) => {
    e.preventDefault();
    // Pass the error to display through state
    alert(
      "You are not authorized to make a post. If you create an account you can begin making posts."
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    alert("Start being alerted when user makes posts.");
    if (props.user) {
      await axios.put(`/api/user/${props.user._id}`, {
        savedArticles: [props.article._id],
      });
      setSavedArticleState(!savedArticleState);
    }
  };

  const handleNotification = async (e) => {
    e.preventDefault();
    // Create notification function on backend
    alert("Start being alerted when user makes posts.");
    if (props.user) {
      console.log(props.user);
      await axios.put(`/api/user/${props.user._id}`, {
        notifications: [props.article._id],
      });
      setNotifications(!notifications);
    }
  };
  return (
    <StyledLeftContainer>
      <JustifyContent>
        <Link to="/">
          <LogoImage src={logo} alt="logo" />
        </Link>
      </JustifyContent>
      <StackedAlignn>
        <Link to="/">
          <BsHouseDoor style={{ marginBottom: "5rem" }} />
        </Link>
        {notifications ? (
          <BsBellFill
            onClick={handleNotification}
            style={{ marginBottom: "5rem" }}
          />
        ) : (
          <BsBell
            onClick={handleNotification}
            style={{ marginBottom: "5rem" }}
          />
        )}
        {!savedArticleState ? (
          <MdBookmarkBorder
            onClick={handleSave}
            style={{ marginBottom: "5rem" }}
          />
        ) : (
          <MdBookmark onClick={handleSave} style={{ marginBottom: "5rem" }} />
        )}
        <ArticleHr />
        {isAdmin ? (
          <Link to="/admin/blog/new">
            <HiOutlinePencilAlt style={{ marginBottom: "5rem" }} />
          </Link>
        ) : (
          <HiOutlinePencilAlt
            onClick={handleUnauthorized}
            style={{ marginBottom: "5rem" }}
          />
        )}
      </StackedAlignn>
    </StyledLeftContainer>
  );
};

export default SideBar;
