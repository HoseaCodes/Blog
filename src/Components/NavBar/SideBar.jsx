import React from "react";
import {StyledLeftContainer, JustifyContent} from '../../Layout/Container/styledArticle';
import {LogoImage} from '../../Layout/Image/styledImage';
import {StackedAlignn} from '../../Layout/Icon/styledIcons';
import {ArticleHr} from '../../Layout/Hr/styledHr';
import {HiOutlinePencilAlt} from 'react-icons/hi';
import {BsHouseDoor, BsBell} from 'react-icons/bs';
import {MdBookmarkBorder} from 'react-icons/md';
import logo from '../../Assets/Images/newLogo.png';

const SideBar = () => {

    return (
      <StyledLeftContainer>
        <JustifyContent >
          <LogoImage src={logo} alt="logo"/>
        </JustifyContent>
        <StackedAlignn >
          <BsHouseDoor style={{marginBottom: '5rem'}}/>
          <BsBell style={{marginBottom: '5rem'}}/>
          <MdBookmarkBorder style={{marginBottom: '5rem'}}/>
          <ArticleHr/>
          <HiOutlinePencilAlt style={{marginBottom: '5rem'}}/>
        </StackedAlignn>
      </StyledLeftContainer>
    )
}


export default SideBar;
