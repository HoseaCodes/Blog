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

const StickyFooter = ({id, likes, setViewComment, viewComment}) => {
  const [postLikes, setPostLikes] = useState(likes)

  useEffect(() => {

	}, [likes]);

  const handleLike = async () => {
		try {
			const updateLike = await axios.put(`/api/articles/${id}/likes`, { likes: postLikes });
      setPostLikes(parseInt(updateLike.data.totalLikes))
		} catch (err) {
			alert(err.response.data.msg);
		}
	};
  return (
          <Sticky >
            <div  className="bottom sticky">
              <ArticleHr Primary/>
              <JustifyContent SpaceAround>
                <JustifyContent Font2>
                  <JustifyContent MarginRight>
                    <FaRegThumbsUp onClick={handleLike}/> &nbsp; <span>{postLikes}</span> &nbsp;
                  </JustifyContent>
                  <JustifyContent MarginRight>
                    <FaRegComment onClick={() => setViewComment(true)}/> &nbsp; <span>1</span>
                  </JustifyContent>
                </JustifyContent>
                <Font2>
                  <FaFacebook/>
                  <AiFillTwitterCircle/>
                  <TiSocialLinkedinCircular/>
                  <RiShareCircleFill/>
                  <MdBookmarkBorder/>
                </Font2>
              </JustifyContent>
            </div>
          </Sticky>
  )
}

export default StickyFooter;
