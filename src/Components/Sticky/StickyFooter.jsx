import React from 'react';
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

const StickyFooter = () => {
  return (
          <Sticky >
            <div  className="bottom sticky">
              <ArticleHr Primary/>
              <JustifyContent SpaceAround>
                <JustifyContent Font2>
                  <JustifyContent MarginRight>
                    <FaRegThumbsUp/> &nbsp; <span>1</span>
                  </JustifyContent>
                  <JustifyContent MarginRight>
                    <FaRegComment/> &nbsp; <span>1</span>
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
