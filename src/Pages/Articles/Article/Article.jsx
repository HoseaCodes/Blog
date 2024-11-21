import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalState } from "../../../GlobalState";
import "../Articles.css";
import moment from "moment-timezone";
import SideBar from "../../../Components/NavBar/SideBar";
import RightColumn from "../../../Components/Article/RightColumn";
import MainContainer from "../../../Components/Article/MainContainer";
import { BlogContent } from "../../../Layout/Container/styledArticle";
import axios from "axios";
import { countWords } from "../../../Utils/helperFunctions";

const ArticleItem = () => {
  const params = useParams();
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [user] = state.userAPI.user;
  const [isAdmin] = state.userAPI.isAdmin;
  const [articles] = state.articlesAPI.articles;
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [detailArticle, setdetailArticle] = useState([]);
  const [viewComment, setViewComment] = useState(false);


  useEffect(() => {
    if (params.id) {
      articles.forEach((article) => {
        if (article._id === params.id) setdetailArticle(article);
      });
    }
  }, [params.id, articles]);

  useEffect(async () => {
    if (params.id) {
      let orgArticle = articles.filter((article) => article._id === params.id);
      await axios.put(
        `/api/articles/${params.id}`,
        {
          views: (orgArticle.views += 1),
        },
        {
          headers: { Authorization: token },
        }
      );
    }
  }, [params.id]);

  if (detailArticle.length === 0) return null;

  const { createdAt, markdown } = detailArticle;

  const timeFormater = moment.utc(createdAt).format("MMMM Do YYYY");
  const avgWordsMinRead = 238;
  const wordCount = countWords(markdown);
  const readTime = Math.round(wordCount / avgWordsMinRead);
  return (
    <>
      <main className="blog-content">
        {user.name !== "" && (
          <SideBar
            user={user}
            article={detailArticle}
            className="d-none d-lg-block"
          />
        )}
        <MainContainer
          isAdmin={isAdmin}
          isLoggedIn={isLoggedIn}
          viewComment={viewComment}
          setViewComment={setViewComment}
          user={user}
          articles={articles}
          timeFormater={timeFormater}
          readTime={readTime}
          detailArticle={detailArticle}
        />
        <RightColumn
          setViewComment={setViewComment}
          viewComment={viewComment}
          user={user}
          articles={articles}
        />
      </main>
    </>
  );
};

export default ArticleItem;
