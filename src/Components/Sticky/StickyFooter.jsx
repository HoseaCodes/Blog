import React, { useState, useEffect } from 'react';
import axios from "axios";
import Sticky from 'react-sticky-state';
import {ArticleHr} from '../../Layout/Hr/styledHr';
import {AiFillTwitterCircle } from 'react-icons/ai';
import {FaRegThumbsUp, FaRegComment, FaFacebook} from 'react-icons/fa';
import {Font2} from '../../Layout/Text/styledText';
import {JustifyContent} from '../../Layout/Container/styledArticle';
import {MdBookmarkBorder} from 'react-icons/md';
import {RiShareCircleFill} from 'react-icons/ri';
import {TiSocialLinkedinCircular} from 'react-icons/ti';

import './StickyState.css';

const StickyFooter = ({id, likes, setViewComment, comments, user, article}) => {
  const [postLikes, setPostLikes] = useState(likes)

  console.log(comments)
  useEffect(() => {

	}, [likes]);

  const handleLike = async () => {
		try {
			const updateLike = await axios.put(`/api/articles/${id}/likes`, { likes: postLikes });
      setPostLikes(parseInt(updateLike.data.totalLikes))
      if (user) {
        await axios.put(`/api/user/${user._id}`, {
          likedArticles: [article._id],
        });
      }
		} catch (err) {
			alert(err.response.data.msg);
		}
	};

  const handleComment = async () => {
    try {
      setViewComment(true)
    } catch (error) {
      alert(error);
    }
  }

  return (
    <Sticky>
      <div className="bottom sticky">
        <ArticleHr Primary />
        <JustifyContent SpaceAround>
          <JustifyContent Font2>
            <JustifyContent MarginRight>
              <FaRegThumbsUp onClick={handleLike} /> &nbsp;{" "}
              <span>{postLikes}</span> &nbsp;
            </JustifyContent>
            <JustifyContent MarginRight>
              <FaRegComment onClick={() => handleComment()} /> &nbsp;{" "}
              <span>{comments.length - 1 || 0}</span>
            </JustifyContent>
          </JustifyContent>
          <Font2>
            <a
              href="https://www.facebook.com/ambitiousconcept"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook style={{ color: "green" }} />
            </a>
            <a
              href="https://twitter.com/DominiqueRHosea"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiFillTwitterCircle style={{ color: "green" }} />
            </a>
            <a
              href="https://www.linkedin.com/in/dominique-hosea/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TiSocialLinkedinCircular style={{ color: "green" }} />
            </a>
            {/* <RiShareCircleFill/> */}
            {/* <MdBookmarkBorder/> */}
          </Font2>
        </JustifyContent>
      </div>
    </Sticky>
  );
}

export default StickyFooter;
