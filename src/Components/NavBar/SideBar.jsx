import React, { useContext, useEffect } from "react";
import {StyledLeftContainer, JustifyContent} from '../../Layout/Container/styledArticle';
import {LogoImage} from '../../Layout/Image/styledImage';
import {StackedAlignn} from '../../Layout/Icon/styledIcons';
import {ArticleHr} from '../../Layout/Hr/styledHr';
import {HiOutlinePencilAlt} from 'react-icons/hi';
import {BsHouseDoor, BsBell} from 'react-icons/bs';
import {MdBookmarkBorder} from 'react-icons/md';
import logo from '../../Assets/Images/newLogo.png';
import { Link } from "react-router-dom";
import {GlobalState} from '../../GlobalState';
import { useParams } from "react-router-dom";
import axios from "axios";

const SideBar = (props) => {

  const param = useParams();
  const state = useContext(GlobalState);

  const [isAdmin] = state.userAPI.isAdmin;

  const handleUnauthorized = async e => {
    e.preventDefault();
    // Pass the error to display through state
    alert("You are not authorized to make a post. If you create an account you can begin making posts.")
  }

  const handleSave = async e => {
    e.preventDefault();
    // Create save post function on backend
    alert("Save the post to user profile.")
     if (props.user) {
       console.log(props.user);
       await axios.put(`/api/user/${props.user._id}`, {
         savedArticles: [props.article._id],
       });
     }
  }

  const handleNotification = async e => {
    e.preventDefault();
    // Create notification function on backend
    alert("Start being alerted when user makes posts.")
    if (props.user) {
      console.log(props.user);
      await axios.put(`/api/user/${props.user._id}`, {
        notifications: [props.user._id],
      });
    }
  }
    return (
      <StyledLeftContainer>
        <JustifyContent >
          <Link to="/">
            <LogoImage src={logo} alt="logo"/>
          </Link>
        </JustifyContent>
        <StackedAlignn >
          <Link to="/"><BsHouseDoor style={{marginBottom: '5rem'}}/></Link>
          <BsBell onClick={handleNotification} style={{marginBottom: '5rem'}}/>
          <MdBookmarkBorder onClick={handleSave} style={{marginBottom: '5rem'}}/>
          <ArticleHr/>
          {isAdmin ?
            <Link to="/admin/blog/new"><HiOutlinePencilAlt style={{marginBottom: '5rem'}}/></Link>
            :
            <HiOutlinePencilAlt onClick={handleUnauthorized} style={{marginBottom: '5rem'}}/>
          }
        </StackedAlignn>
      </StyledLeftContainer>
    )
}


export default SideBar;
