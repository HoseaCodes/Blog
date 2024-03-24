import React from 'react';
import {AiOutlineMail } from 'react-icons/ai';
import {ArticleInput} from '../../Layout/Input/styledInput';
import {BlogContent} from '../../Layout/Text/styledText';
import {MarginTop} from '../../Layout/Margin/styledMargin';
import {JustifyContent, BlogNewsletter} from '../../Layout/Container/styledArticle';
import { Button } from '../Button/Button';

const Newsletter = () => {
  return (
    <BlogNewsletter
      action="https://getform.io/f/7efda21f-ca67-48f6-8a1e-723776d4ae3b"
      method="POST"
      className="d-none d-md-block"
    >
      <div>
        <h3>Sign up for Software Engineering News</h3>
        <BlogContent Author>By Dominique Hosea</BlogContent>
        <BlogContent Newsletter>
          Latest news from Analytics Vidhya on our Hackathons and some of our
          best articles!&nbsp;
          <u>Take a look.</u>
        </BlogContent>
        <JustifyContent SpaceAroundPaddingRight>
          <ArticleInput
            name="email_address"
            placeholder="Your email"
            type="text"
          />
          <ArticleInput
            style={{ display: "none" }}
            name="from"
            value={"Newsletter"}
            type="text"
          />
          <Button
            icon={<AiOutlineMail style={{ fontSize: "4.5rem" }} />}
            size='large'
            label="&nbsp;  Get this newsletter"
            type="submit"
            style={{ fontWeight: 'normal',  backgroundColor: "green", display: "flex", alignItems: "center"}}
          />
        </JustifyContent>
        <MarginTop>
          By signing up, you will create a Medium account if you don’t already
          have one. Review our Privacy Policy for more information about our
          privacy practices.
        </MarginTop>
      </div>
    </BlogNewsletter>
  );
}

export default Newsletter;
