import React from 'react';
import Alert from 'react-bootstrap/Alert'
import { AiFillStar } from 'react-icons/ai';
import {JustifyContent, StyledMainContainer,
  PaddingContent, BlogCard, BlogPost} from '../../Layout/Container/styledArticle';
import {CircleImage, BlogDisplayImage} from '../../Layout/Image/styledImage';
import {NamePlate, WarppedDate, GrayText, DisplayItem, BlogTitle, BlogSubTitle,
  BlogPhotoCredit, BlogContent} from '../../Layout/Text/styledText';
import {ArticleHr} from '../../Layout/Hr/styledHr';
import {AlertP} from '../../Layout/Paragraph/styledParagraph';
import {AlertLink} from '../../Layout/ATag/styledATag';
import TextToSpeech from './TextToSpeech';
import marked from 'marked';
import Newsletter from '../Subscribe/Newsletter';
import RelatedPosts from './RelatedPosts';
import StickyFooter from '../Sticky/StickyFooter';
import BtnRender from './BtnRender';

const MainContainer = (props) => {
  const { _id, likes, title, subtitle, description, images, markdown, comments } = props.detailArticle;
  const timeFormater = props.timeFormater;
  const readTime = props.readTime;
  const user = props.user
  const avatar = user.avatar === "" ?
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"
  : user.avatar; 
  return (
    <StyledMainContainer>
      <PaddingContent>
        <section>
          {user.name !== "" && (
            <Alert transition="false" variant="light">
              <AlertP>
                You have <strong style={{ color: "black" }}>1</strong> free
                member-only story left this month.&nbsp;
                <AlertLink href="#">
                  Sign up for Medium and get an extra one.
                </AlertLink>
              </AlertP>
            </Alert>
          )}
          <JustifyContent AlignCenter>
            <CircleImage src={avatar} alt="author" />
            <div>
              <NamePlate>Author: {user.name || "Will Smith"}</NamePlate>
              <WarppedDate>
                <GrayText>{timeFormater}</GrayText>
                <span>&nbsp;&#183;&nbsp;</span>
                <DisplayItem>
                  {readTime} min read &nbsp; <AiFillStar />
                </DisplayItem>
                <span>&nbsp;&#183;&nbsp;</span>
                <TextToSpeech text={markdown} />
              </WarppedDate>
            </div>
          </JustifyContent>
          <ArticleHr Primary />
          <BlogTitle>{title}</BlogTitle>
          <BlogSubTitle>{subtitle}</BlogSubTitle>
          <BlogDisplayImage src={images.url} alt={title} />
          <BlogPhotoCredit>
            Photo Credit by &nbsp;<u>{user.name || "Anonymous"}</u>
          </BlogPhotoCredit>
          <BlogCard>
            <br />
            <BlogPost>
              <br />
              <BlogContent>{description}</BlogContent>
              <br />
              <br />
              <BlogContent
                Markdown
                dangerouslySetInnerHTML={{ __html: marked(markdown) }}
              ></BlogContent>
              <br />
              <StickyFooter
                comments={comments}
                viewComment={props.viewComment}
                setViewComment={props.setViewComment}
                id={_id}
                likes={likes}
                user={user}
                article={props.detailArticle}
              />
              <Newsletter />
            </BlogPost>
            {props.isAdmin && props.isLoggedIn ? (
              <>
                <input
                  type="checkbox"
                  checked={true}
                  onChange={() => props.handleCheck(_id)}
                />
                <BtnRender
                  article={props.article}
                  deleteArticle={props.deleteArticle}
                />
              </>
            ) : null}
          </BlogCard>
        </section>
      </PaddingContent>
      <RelatedPosts
        user={user}
        articles={props.articles}
        timeFormater={timeFormater}
        readTime={readTime}
      />
    </StyledMainContainer>
  );
}


export default MainContainer;
