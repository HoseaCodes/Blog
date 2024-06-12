import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../GlobalState";
import { useHistory, useParams } from "react-router-dom";
import axios from "axios";
import "./CreateArticle.css";
import { v4 as uuidv4 } from "uuid";
import Error401 from "../Error/Error401";
import { articleTempltes } from "./ArticleTemplate";
import { sleep, getBasicAuth } from "../../Utils/helperFunctions";
import moment from "moment";
import MultiStepForm from "../../Components/Form/MultiStep/MultiStepForm";

function CreateArticle() {
  const [markdown, setMarkdown] = useState(articleTempltes[3].markdown);
  const todaysDate = moment().format("YYYY-MM-DD");
  const initialState = {
    article_id: uuidv4(),
    title: "",
    subtitle: "",
    description: "",
    markdown: markdown,
    categories: "",
    id: "",
    series: "Hoseacodes",
    dev: false,
    medium: false,
    archived: false,
    draft: false,
    scheduled: false,
    linkedin: false,
    linkedinContent: "",
    tweet: false,
    tweetContent: "",
    scheduledDate: todaysDate,
    images: {
      secure_url: "",
    },
  };
  const state = useContext(GlobalState);
  const [articles] = state.articlesAPI.articles;
  const [callback, setCallback] = state.articlesAPI.callback;
  const [token] = state.token;
  const [user] = state.userAPI.user;
  const [article, setArticle] = useState(initialState);
  const [images, setImages] = useState(false);
  const history = useHistory();
  const param = useParams();
  const [onEdit, setOnEdit] = useState(false);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const loggedIn = localStorage.getItem("isLoggedIn");
  const [selectedCategory, setselectedCategory] = useState("Programming");
  const [allBlogCategory, setAllBlogCategory] = useState([]);
  const [linkedinAccessToken, setLinkedinAccessToken] = useState("");

  useEffect(() => {
    if (!loggedIn) {
      sleep(5000);
      history.push("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!images) return alert("No Image Upload");
      if (onEdit) {
        await axios.put(
          `/api/articles/${article._id}`,
          {
            ...articles,
            images,
          },
          {
            headers: { Authorization: token },
          }
        );
      } else {
        article.scheduledDate <= todaysDate
          ? (article.scheduledDate = null)
          : (article.scheduled = true);
        setArticle({
          ...article,
          ["article_id"]: uuidv4(),
          categories: [selectedCategory],
          id: user.id,
        });
        setArticle({
          ...article,
          ["slug"]: article.title.toLowerCase().replace(/ /g, "-"),
        });
        const username = process.env.REACT_APP_USERNAME || "admin";
        const password = process.env.REACT_APP_PASSWORD || "password";
        const auth = getBasicAuth(username, password);
        await axios.post(
          "/api/articles",
          { ...article, images, ...user, linkedinAccessToken },
          {
            headers: {
              Authorization: auth,
            },
          }
        );
        setImages(false);
        setArticle(initialState);
      }
      setCallback(!callback);

      history.push("/blog");
    } catch (err) {
      alert(err.response.data.msg);
    }
  };

  useEffect(async () => {
    const config = { headers: { "Content-Type": "application/json" } };
    const res = await axios.get("/api/category", config);
    if (res) {
      setAllBlogCategory(res.data.categories);
    }
  }, []);

  useEffect(() => {
    if (param.id) {
      setOnEdit(true);
      if (articles !== undefined) {
        articles.forEach((article) => {
          if (article._id === param.id) {
            setArticle(article);
            setImages(article.images);
          }
        });
      }
    } else {
      setOnEdit(false);
      setArticle(initialState);
      // setImages(false)
    }
  }, [param.id, articles]);

  console.log({ article });
  return (
    <>
      {loggedIn ? (
        <div className="create_article">
          <div className="container fluid col-md-12">
            <div className="panel panel-default">
              <form className="row g-3" onSubmit={handleSubmit}>
                <MultiStepForm
                  articleTempltes={articleTempltes}
                  allBlogCategory={allBlogCategory}
                  article={article}
                  history={history}
                  images={images}
                  linkedinAccessToken={linkedinAccessToken}
                  onEdit={onEdit}
                  selectedCategory={selectedCategory}
                  setAllBlogCategory={setAllBlogCategory}
                  setArticle={setArticle}
                  setImages={setImages}
                  setLinkedinAccessToken={setLinkedinAccessToken}
                  setMarkdown={setMarkdown}
                  setOnEdit={setOnEdit}
                  setselectedCategory={setselectedCategory}
                  token={token}
                />
              </form>
            </div>
          </div>
        </div>
      ) : (
        <Error401 />
      )}
    </>
  );
}

export default CreateArticle;
