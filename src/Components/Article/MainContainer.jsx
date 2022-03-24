import React from 'react';
import Alert from 'react-bootstrap/Alert'
import { AiFillStar, AiFillPlayCircle } from 'react-icons/ai';
import {JustifyContent, StyledMainContainer,
  PaddingContent, BlogCard, BlogPost} from '../../Layout/Container/styledArticle';
import {CircleImage, BlogDisplayImage} from '../../Layout/Image/styledImage';
import {NamePlate, WarppedDate, GrayText, DisplayItem, BlogTitle, BlogSubTitle,
  BlogPhotoCredit, BlogContent} from '../../Layout/Text/styledText';
import {ArticleHr} from '../../Layout/Hr/styledHr';
import {AlertP} from '../../Layout/Paragraph/styledParagraph';
import {AlertLink} from '../../Layout/ATag/styledATag';
import marked from 'marked';
import Newsletter from '../Subscribe/Newsletter';
import RelatedPosts from './RelatedPosts';
import StickyFooter from '../Sticky/StickyFooter';

const MainContainer = (props) => {

  const {  title, subtitle, description, images, markdown } = props.detailArticle;
  const timeFormater = props.timeFormater;
  const readTime = props.readTime;
  const user = props.user

  return (
        <StyledMainContainer>
          <PaddingContent>
            <section>
              <Alert transition="false" variant="light">
                <AlertP>
                  You have <strong style={{ color: 'black' }}>1</strong> free member-only story left this month.&nbsp;
                  <AlertLink href="#">Sign up for Medium and get an extra one.</AlertLink>
                </AlertP>
              </Alert>
              <JustifyContent AlignCenter>
                <CircleImage src={user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                    alt="author" />
                <div>
                  <NamePlate>{user.name || "Will Smith"}</NamePlate>
                  <WarppedDate>
                    <GrayText>{timeFormater}</GrayText>
                    <span>&nbsp;&#183;&nbsp;</span>
                    <DisplayItem>{readTime} min read &nbsp; <AiFillStar/></DisplayItem>
                    <span>&nbsp;&#183;&nbsp;</span>
                    <DisplayItem Green><AiFillPlayCircle style={{fontSize: 'larger'}}/> &nbsp; Listen</DisplayItem>
                  </WarppedDate>
                </div>
              </JustifyContent>
              <ArticleHr Primary/>
                <BlogTitle>{title}</BlogTitle>
                <BlogSubTitle>{subtitle}</BlogSubTitle>
                <BlogDisplayImage src={images.url} alt={title}  />
                <BlogPhotoCredit>Photo Credit by <u>You</u></BlogPhotoCredit>
              <BlogCard>
                <br />
                <BlogPost>
                  <br />
                  <BlogContent>{description}</BlogContent>
                  <br />
                  <br />
                  <BlogContent Markdown  dangerouslySetInnerHTML={{ __html: marked(markdown) }}></BlogContent>
                  <br />
                  <StickyFooter/>
                  <Newsletter/>
                </BlogPost>
                {/* <input type="checkbox" checked={checked}
                  onChange={() => props.handleCheck(_id)} /> */}
                {/* <BtnRender article={props.article} deleteArticle={props.deleteArticle} /> */}
              </BlogCard>
            </section>
          </PaddingContent>
          <RelatedPosts user={user} articles={props.articles} timeFormater={timeFormater} readTime={readTime}/>
        </StyledMainContainer>
  )
}


export default MainContainer;
