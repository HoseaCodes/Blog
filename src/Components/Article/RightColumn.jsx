import React from 'react';
import {PageLinks, StyledRightContainer, AlignContent, SideUserContainer,
  PostContainer} from '../../Layout/Container/styledArticle';
import {SquareImage, CircleImage} from '../../Layout/Image/styledImage';
import {UserInfo, PostText, NoMargin, Subtitle} from '../../Layout/Text/styledText';
import {ArticleBtn} from '../../Layout/Button/styledButton';
import {ArticleLink, ArticleLinkColor} from '../../Layout/ATag/styledATag';
import {MdBookmarkBorder} from 'react-icons/md';
import { MarginTop } from '../../Layout/Margin/styledMargin';
import { ArticleInput } from '../../Layout/Input/styledInput';

const RightColumn = () => {

  return (
          <StyledRightContainer>
            <AlignContent Center>
              <ArticleBtn RightColumn >Get Started</ArticleBtn>
              <ArticleLinkColor Green href='#'>Sign In</ArticleLinkColor>
            </AlignContent>
                <MarginTop RightCloumnSearch>
                  <ArticleInput Search placeholder='Search' type="text"/>
                </MarginTop >
                <SideUserContainer Primary>
                  <CircleImage Secondary src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                            alt="author" />
                  <UserInfo Padding4>Will Smith</UserInfo>
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
                  <PostContainer>
                    <SquareImage src={"https://okteto.com/static/ac268f62ae1c1edd1802a3b841bf2c5a/cover.png"}
                            alt="post" />
                    <SideUserContainer>
                      <h5>FastAPI: Complete API Development</h5>
                      <Subtitle Primary> FastAPI: Complete API Development</Subtitle>
                    </SideUserContainer>
                  </PostContainer>
                  <PostContainer Secondary>
                    <SquareImage src={"https://makeameme.org/media/templates/250/dr_evil_austin_powers.jpg"}
                            alt="post" />
                    <SideUserContainer>
                      <NoMargin>Handling MongoDb ObjectId in Python FastAPI</NoMargin>
                      <Subtitle Primary> Keep it simlpe but significant</Subtitle>
                    </SideUserContainer>
                  </PostContainer>
                  <PostContainer Secondary>
                    <SquareImage src={"https://miro.medium.com/max/1200/1*OdqgwkO9B5A29LP9Vb9rHQ.png"}
                            alt="post" />
                    <SideUserContainer>
                      <NoMargin>Pydantic — Better Data Validation for Python</NoMargin>
                      <Subtitle Primary> “Data validation and settings management using Python type hinting."</Subtitle>
                    </SideUserContainer>
                  </PostContainer>
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
