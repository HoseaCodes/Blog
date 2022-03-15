import React from 'react';
import {AiOutlineMail } from 'react-icons/ai';
import {ArticleBtn} from '../../Layout/Button/styledButton';
import {ArticleInput} from '../../Layout/Input/styledInput';
import {BlogContent} from '../../Layout/Text/styledText';
import {MarginTop} from '../../Layout/Margin/styledMargin';
import {JustifyContent, BlogNewsletter} from '../../Layout/Container/styledArticle';

const Newsletter = () => {
  return (
        <BlogNewsletter>
          <div>
            <h3>Sign up for Software Engineering News</h3>
            <BlogContent Author>By Dominique Hosea</BlogContent>
            <BlogContent Newsletter>Latest news from Analytics Vidhya on our Hackathons and some of our best articles!&nbsp;
              <u>Take a look.</u>
            </BlogContent>
            <JustifyContent SpaceAroundPaddingRight>
              <ArticleInput placeholder='Your email' type="text" />
              <ArticleBtn><AiOutlineMail style={{fontSize: '2.5rem'}}/>&nbsp;  Get this newsletter</ArticleBtn>
            </JustifyContent>
            <MarginTop>By signing up, you will create a Medium account if you don"’"t already have one.
              Review our Privacy Policy for more information about our privacy practices.</MarginTop>
          </div>
        </BlogNewsletter>
  )
}

export default Newsletter;
