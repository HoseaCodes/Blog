import React, { useState } from 'react';
import {MdBookmarkBorder} from 'react-icons/md';
import {JustifyContent, AlignContent, Tag,
  BlogCard, GrayDiv} from '../../Layout/Container/styledArticle';
import {CircleImage} from '../../Layout/Image/styledImage';
import {NamePlate} from '../../Layout/Text/styledText';
import {MarginTop} from '../../Layout/Margin/styledMargin';
import {ArticleMainHr} from '../../Layout/Hr/styledHr';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import {Button} from '../../Components/Button/Button';

const RelatedPosts = (props) => {

  const {timeFormater, readTime} = props;
  const articles = props.articles;
  const user = props.user;
  const history = useHistory()
  const [idx, setIdx] = useState(4)
  const [moreArticles, setMoreArticles] = useState(true)
  const [recentPosts, setRecentPosts] = useState(articles.slice(0, idx))

  const handleReadMore = async () => {
    setIdx(idx + 2)
    if (articles.length > idx) {
      setRecentPosts(articles.slice(0, (idx)))
    }  else {
      setRecentPosts(articles)
      setMoreArticles(!moreArticles)
    }
  }

  return (
    <MarginTop Whitesmoke>
      {recentPosts.map((article) => {
        return (
          <div key={article.id}>
            <BlogCard RelatedPost>
              <AlignContent>
                <CircleImage
                  Secondary
                  src={
                    user.avatar ||
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"
                  }
                  alt="author"
                />
                <NamePlate>{user.name || "Will Smith"}</NamePlate>
                <span>&nbsp;&#183;&nbsp;</span>
                <GrayDiv>{timeFormater}</GrayDiv>
              </AlignContent>
              <AlignContent Column>
                <div style={{ marginRight: "1rem" }}>
                  <a href={`/blog/${article._id}`}>
                    <h4>
                      {article.title ||
                        "No Code Approach — Process Speech and convert to Text — Logic Apps"}
                    </h4>
                  </a>
                  <p style={{ width: "80%" }}>
                    {" "}
                    {article.description ||
                      "Using Azure Cognitive Services Speech to Text and Logic apps No Code — Workflow style We can re use the same pattern for other Azure Cognitive..."}
                  </p>
                </div>
                <img
                  height={"250rem"}
                  width={"450rem"}
                  src={
                    article.images.url ||
                    "https://tateeda.com/wp-content/uploads/2020/05/2.png"
                  }
                  alt="post"
                />
              </AlignContent>
              <JustifyContent MiniPost>
                <AlignContent Inherit>
                  <Tag>Software</Tag>
                  <AlignContent Gray>
                    <span>{readTime} min read</span>
                  </AlignContent>
                </AlignContent>
                <MdBookmarkBorder style={{ fontSize: "2.5rem" }} />
              </JustifyContent>
            </BlogCard>
            <ArticleMainHr />
          </div>
        );
      })}
      <AlignContent CenterBtn>
        <Button
          backgroundColor={`${!moreArticles ? "gray" : "green"}`}
          label="Read more"
          onClick={handleReadMore}
          disabled={!moreArticles}
        />
      </AlignContent>
    </MarginTop>
  );
}

export default RelatedPosts;
