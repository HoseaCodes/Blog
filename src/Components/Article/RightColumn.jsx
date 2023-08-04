import React, {useContext, useState, useEffect } from 'react';
import {PageLinks, StyledRightContainer, AlignContent, SideUserContainer,
  PostContainer} from '../../Layout/Container/styledArticle';
import {SquareImage, CircleImage} from '../../Layout/Image/styledImage';
import {UserInfo, PostText, Subtitle} from '../../Layout/Text/styledText';
import {ArticleBtn} from '../../Layout/Button/styledButton';
import {ArticleLink, ArticleLinkColor} from '../../Layout/ATag/styledATag';
import {MdBookmarkBorder, MdClose} from 'react-icons/md';
import {BiCheckShield, BiDotsHorizontalRounded} from 'react-icons/bi';
import { MarginTop } from '../../Layout/Margin/styledMargin';
import { ArticleInput } from '../../Layout/Input/styledInput';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const RightColumn = ({user, articles}) => {

  const history = useHistory();
  // const uri = window.location.pathname;
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [search, setSearch] = useState('')
  const [viewComment, setViewComment] = useState(true)
  const [comments, setComments] = useState({comments: []})
  const param = useParams()

  const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
  const recentPosts = shuffleArray(articles)
        .filter((article) => {
          // article._id !== uri.split('/')[2]
          return article.title.toLowerCase().indexOf(
            search.toLowerCase()) !== -1;
        })
        .slice(0, 5);

  const updateSearch = event => {
    const { value } = event.target
    setSearch(value.substr(0, 20))
  }
  const handleClick= async (e) => {
    history.push(`/${e}`)
  }

  useEffect(() => {
    const id =  param.id   

    if (id) {
        const getComments = async () => {
          const res = await axios.get(`/api/articles/${id}/comments`)
          let filteredComments = res.data.comments.filter((comment) => {
              return comment.blog === id;
          });
          setComments({comments: filteredComments});
        }
        getComments()
    }
  }, [param.id])

  return (
    <>
      {
        viewComment ?
          <StyledRightContainer>
            <AlignContent Center>
              <div style={{display: 'flex', justifyContent: 'space-between', 
              width: '100%', alignItems: 'center'}}>
                <div>
                  <h4><strong>Responses ({comments.comments.length})</strong></h4>
                </div>
                <div>
                  <span><BiCheckShield style={{fontSize: '2.5rem'}} /></span>
                  <span><BiDotsHorizontalRounded style={{fontSize: '2.5rem'}}/></span>
                  <span><MdClose style={{fontSize: '2.5rem'}}/></span>
                </div>
              </div>
            </AlignContent>
            <div>
              <img src="" alt="" srcset="" />
              <h3>Name</h3>
              <textarea placeholder='What are your thoughts?' name="" id="" cols="30" rows="10"></textarea>
              <button>Cancel</button>
              <button>Respond</button>
            </div>
            <select name="" id="" disabled="disabled">
              <option value="Relevant">Most Relevant</option>
              <option value="Recent">Most Recent</option>
            </select>
            <hr />
            {
              comments !== undefined && 
              comments.comments.length !== 0 ?
              <>
                {comments.comments.map(comment => {
                  return (
                    <div key={comment._id}>
                      <div>
                        <img src="" alt="" srcset="" />
                        <h3>{comment.name}</h3> <span>Reference towards the blog writer</span>
                        <p>minutes ago</p>
                      </div>
                      <div>
                        <span>Settings Icon</span>
                      </div>
                      <div>
                        {comment.comment}
                      </div>
                      <div>
                        <button>like</button>
                        <button>Reply</button>
                      </div>
                    </div>
                )})}
              </>
              :
              <>No Comments</>
            }
          </StyledRightContainer>
        :
          <StyledRightContainer>
            <AlignContent Center>
              {!isLoggedIn ?
              <>
                <ArticleBtn RightColumn onClick={() => handleClick('register')} >Get Started</ArticleBtn>
                <ArticleLinkColor Green href='/login'>Sign In</ArticleLinkColor>
              </>
              :
                <h2>Welcome, {user.name.split(' ')[0]}</h2>
              }
            </AlignContent>
                <MarginTop RightCloumnSearch>
                  <ArticleInput Search 
                  placeholder='Search' 
                  type="text"
                  value={search}
                  onChange={updateSearch}/>
                </MarginTop >
                <SideUserContainer Primary>
                  <CircleImage Secondary src={user.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                            alt="author" />
                  <UserInfo Padding4>{user.name || "Will Smith"}</UserInfo>
                  <UserInfo GrayWPadding>119 Followers</UserInfo>
                  <UserInfo GrayWPadding>
                    Software Engineer | Python Programmer | Java Programmer | Tech Enthusiast | JavaScript Programmer | React Lover | Mobile Developer
                  </UserInfo>
                </SideUserContainer>
                <SideUserContainer ButtonGroup>
                  <ArticleBtn Follow>Follow</ArticleBtn>
                  <ArticleBtn Follow><MdBookmarkBorder style={{fontSize: '2rem'}}/></ArticleBtn>
                </SideUserContainer>
                <SideUserContainer Primary>
                  <PostText>Related</PostText>
                  {recentPosts.map(article => {
                      return (
                          <div key={article._id}>
                            <PostContainer>
                              <SquareImage src={article.images.url} alt="post" />
                              <SideUserContainer>
                                <Link to={`/blog/${article._id}`} rel="noopener noreferrer">
                                  <h5>{article.title}</h5>
                                </Link>
                                <Subtitle Primary> {article.subtitle}</Subtitle>
                              </SideUserContainer>
                            </PostContainer>
                            <br/>
                          </div>
                          )
                        })}
                </SideUserContainer>
                <PageLinks >
                  <ArticleLink href='#' >Help</ArticleLink>
                  <ArticleLink href='#' >Status</ArticleLink>
                  <ArticleLink href='#' >Writers</ArticleLink>
                  <ArticleLink href='#' >Blog</ArticleLink>
                  <ArticleLink href='#' >Careers</ArticleLink>
                  <ArticleLink href='#' >Privacy</ArticleLink>
                  <ArticleLink href='#' >Terms</ArticleLink>
                  <ArticleLink href='#' >About</ArticleLink>
                </PageLinks>
          </StyledRightContainer>
      }
    </>
  )
}


export default RightColumn;
