import React from 'react';
import {MdBookmarkBorder} from 'react-icons/md';
import {JustifyContent, AlignContent, Tag, SideUserContainer,
  BlogCard, GrayDiv} from '../../Layout/Container/styledArticle';
import {CircleImage} from '../../Layout/Image/styledImage';
import {NamePlate} from '../../Layout/Text/styledText';
import {MarginTop} from '../../Layout/Margin/styledMargin';
import {ArticleMainHr} from '../../Layout/Hr/styledHr';
import {ReadMore} from '../../Layout/Button/styledButton';

const RelatedPosts = (props) => {

  const {timeFormater, readTime} = props;

  return (
          <MarginTop Whitesmoke>
            <BlogCard RelatedPost>
              <AlignContent>
                <CircleImage Secondary src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                  alt="author"/>
                <NamePlate>Will Smith</NamePlate>
                <span>&nbsp;&#183;&nbsp;</span>
                <GrayDiv>{timeFormater}</GrayDiv>
              </AlignContent>
              <AlignContent>
                <div>
                  <h4> No Code Approach — Process Speech and convert to Text — Logic Apps</h4>
                  <p> Using Azure Cognitive Services Speech to Text and Logic apps No Code — Workflow style
                      We can re use the same pattern for other Azure Cognitive...
                  </p>
                </div>
                <img height={'100px'} width={'150px'} src={"https://tateeda.com/wp-content/uploads/2020/05/2.png"} alt="post"/>
              </AlignContent>
              <JustifyContent MiniPost>
                <AlignContent Inherit>
                  <Tag>Software</Tag>
                  <AlignContent Gray><span>{readTime} min read</span></AlignContent>
                </AlignContent>
                <MdBookmarkBorder style={{fontSize: '2.5rem'}}/>
              </JustifyContent>
            </BlogCard>
            <ArticleMainHr/>
            <SideUserContainer Main>
              <AlignContent>
                <CircleImage Secondary  src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                          alt="author" />
                <NamePlate>Will Smith</NamePlate>
                <span>&nbsp;&#183;&nbsp;</span>
                <GrayDiv>{timeFormater}</GrayDiv>
              </AlignContent>
              <AlignContent>
                <div>
                  <h4> No Code Approach — Process Speech and convert to Text — Logic Apps</h4>
                  <p> Using Azure Cognitive Services Speech to Text and Logic apps No Code — Workflow style
                      We can re use the same pattern for other Azure Cognitive...
                  </p>
                </div>
                <img height={'100px'} width={'150px'} src={"https://tateeda.com/wp-content/uploads/2020/05/2.png"} alt="post"/>
              </AlignContent>
               <JustifyContent MiniPost>
                <AlignContent Inherit>
                  <Tag>Software</Tag>
                  <AlignContent Gray><span>{readTime} min read</span></AlignContent>
                </AlignContent>
                <MdBookmarkBorder style={{fontSize: '2.5rem'}}/>
              </JustifyContent>
            </SideUserContainer>
            <ArticleMainHr/>
            <AlignContent CenterBtn>
              <ReadMore>Read more from me</ReadMore>
            </AlignContent>
          </MarginTop>
  )
}

export default RelatedPosts;
