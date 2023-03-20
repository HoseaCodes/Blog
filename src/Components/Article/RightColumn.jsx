import React, {useContext} from 'react';
import {PageLinks, StyledRightContainer, AlignContent, SideUserContainer,
  PostContainer} from '../../Layout/Container/styledArticle';
import {SquareImage, CircleImage} from '../../Layout/Image/styledImage';
import {UserInfo, PostText, Subtitle} from '../../Layout/Text/styledText';
import {ArticleBtn} from '../../Layout/Button/styledButton';
import {ArticleLink, ArticleLinkColor} from '../../Layout/ATag/styledATag';
import {MdBookmarkBorder} from 'react-icons/md';
import { MarginTop } from '../../Layout/Margin/styledMargin';
import { ArticleInput } from '../../Layout/Input/styledInput';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';

const RightColumn = ({user, articles}) => {

  const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
  const uri = window.location.pathname;
  const recentPosts = shuffleArray(articles)
        .filter((article) => article._id != uri.split('/')[2])
        .slice(0, 5);
  const history = useHistory();
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn

  console.log(user)

  const handleClick= async (e) => {
    history.push(`/${e}`)
  }
  return (
          <StyledRightContainer>
            <AlignContent Center>
              {!isLoggedIn ?
              <>
                <ArticleBtn RightColumn onClick={() => handleClick('register')} >Get Started</ArticleBtn>
                <ArticleLinkColor Green href='/login'>Sign In</ArticleLinkColor>
              </>
              :
                <h2>Welcome, {user.name.split(' ')[0]}</h2>
              }
            </AlignContent>
                <MarginTop RightCloumnSearch>
                  <ArticleInput Search placeholder='Search' type="text"/>
                </MarginTop >
                <SideUserContainer Primary>
                  {/* <CircleImage Secondary src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                            alt="author" /> */}
                  <CircleImage Secondary src={user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                            alt="author" />
                  <UserInfo Padding4>{user.name || "Will Smith"}</UserInfo>
                  <UserInfo GrayWPadding>119 Followers</UserInfo>
                  <UserInfo GrayWPadding>
                    Software Engineer | Python Programmer | Java Programmer | Tech Enthusiast | JavaScript Programmer | React Lover | Mobile Developer
                  </UserInfo>
                </SideUserContainer>
                <SideUserContainer ButtonGroup>
                  <ArticleBtn Follow>Follow</ArticleBtn>
                  <ArticleBtn Follow><MdBookmarkBorder style={{fontSize: '2rem'}}/></ArticleBtn>
                </SideUserContainer>
                <SideUserContainer Primary>
                  <PostText>Related</PostText>
                  {recentPosts.map(article => {
                      return (
                          <div key={article._id}>
                            <PostContainer>
                              <SquareImage src={article.images.url} alt="post" />
                              <SideUserContainer>
                                <Link to={`/blog/${article._id}`} rel="noopener noreferrer">
                                  <h5>{article.title}</h5>
                                </Link>
                                <Subtitle Primary> {article.subtitle}</Subtitle>
                              </SideUserContainer>
                            </PostContainer>
                            <br/>
                          </div>
                          )
                        })}
                </SideUserContainer>
                <PageLinks >
                  <ArticleLink href='#' >Help</ArticleLink>
                  <ArticleLink href='#' >Status</ArticleLink>
                  <ArticleLink href='#' >Writers</ArticleLink>
                  <ArticleLink href='#' >Blog</ArticleLink>
                  <ArticleLink href='#' >Careers</ArticleLink>
                  <ArticleLink href='#' >Privacy</ArticleLink>
                  <ArticleLink href='#' >Terms</ArticleLink>
                  <ArticleLink href='#' >About</ArticleLink>
                </PageLinks>
            </StyledRightContainer>
  )
}


export default RightColumn;
