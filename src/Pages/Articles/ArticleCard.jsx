import React from "react";
import { Link } from "react-router-dom";
import "./Articles.css";
import BtnRender from "../../Components/Article/BtnRender";
// import VisibilityIcon from '@material-ui/icons/Visibility';
import { AiFillEye } from "react-icons/ai";
import moment from "moment-timezone";

const ArticleItem = props => {
  const {
    title,
    createdAt,
    description,
    images,
    _id,
    archived
  } = props.article;
  const timeFormater = moment.utc(createdAt).format("MM/DD/YYYY");
  return (
    <>
      <div className="article-card">
        <div style={{ display: "flex" }}>
          {props.isAdmin && props.isLoggedIn && (
            <input
              type="checkbox"
              checked={false}
              onChange={() => props.handleCheck(_id)}
            />
          )}
          <img className="article-img" src={images.url} alt={title} />
        </div>
        <div className="article-content">
          <div style={{ padding: "1rem" }}>
            {props.isAdmin && props.isLoggedIn ? (
              <input
                type="checkbox"
                name="archive"
                onClick={() => props.archiveArticle(_id, archived)}
              />
            ) : null}
            <Link
              to={`/blog/${_id}`}
              className="article-card-header"
              // onClick={() => this.handleCount()}
            >
              <h2 className="article-card-header">{title}</h2>
            </Link>
            <p className="article-card-meta">
              <span>
                1 &nbsp;
                <AiFillEye /> &nbsp;
              </span>
              {timeFormater}
            </p>
            <p className="work-content">{props.truncate(description)}</p>
            <br />
          </div>
          {props.isAdmin && props.isLoggedIn ? (
            <BtnRender
              article={props.article}
              deleteArticle={props.deleteArticle}
            />
          ) : null}
        </div>
      </div>
      <hr className="article-line" />
    </>
  );
};

export default ArticleItem;
