import React, {useContext, useState, useEffect } from 'react';
import {PageLinks, StyledRightContainer, AlignContent, SideUserContainer,
  PostContainer} from '../../Layout/Container/styledArticle';
import {SquareImage, CircleImage} from '../../Layout/Image/styledImage';
import {UserInfo, PostText, Subtitle} from '../../Layout/Text/styledText';
import {ArticleLink, ArticleLinkColor} from '../../Layout/ATag/styledATag';
import {MdBookmarkBorder, MdClose} from 'react-icons/md';
import {FaRegThumbsUp} from 'react-icons/fa';
import {BiCheckShield, BiDotsHorizontalRounded} from 'react-icons/bi';
import { MarginTop } from '../../Layout/Margin/styledMargin';
import { ArticleInput } from '../../Layout/Input/styledInput';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { GlobalState } from '../../GlobalState';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../Button/Button';

const RightColumn = (props) => {

  const history = useHistory();
  // const uri = window.location.pathname;
  const state = useContext(GlobalState);
  const [currentUser, setCurrentUser] = useState(props.user);
  const [user] = state.userAPI.user
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [search, setSearch] = useState('')
  const [comments, setComments] = useState({comments: []})
  const [comment, setComment] = useState("")
  const param = useParams()

  const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
  const recentPosts = shuffleArray(props.articles)
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
          setComments({ comments: filteredComments });
          await axios.put(`/api/articles/${id}`, {
            comments: filteredComments
          })
        }
        getComments()
    }
  }, [param.id, comment])

  const postComment = async () => {
    try {
      await axios.post(`/api/articles/${param.id}/comments`, {postId: param.id, comment, user})
      const res = await axios.get(`/api/articles/${id}/comments`)
      let filteredComments = res.data.comments.filter((comment) => {
          return comment.blog === id;
      });
      setComments({ comments: filteredComments });
       await axios.put(`/api/articles/${id}`, {
         comments: filteredComments,
       });
    } catch (error) {
      console.log(error)
    }
  }

  const handleChangeInput = e => {
      const { name, value } = e.target
      console.log(name, value)
      setComment(value)
  }

  console.log(user)

  return (
    <>
      {props.viewComment ? (
        <StyledRightContainer className="d-none d-lg-block">
          <AlignContent>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div>
                <h4>
                  <strong>Responses ({comments.comments.length})</strong>
                </h4>
              </div>
              <div>
                <span>
                  <BiCheckShield style={{ fontSize: "2.5rem" }} />
                </span>
                <span>
                  <BiDotsHorizontalRounded style={{ fontSize: "2.5rem" }} />
                </span>
                <span>
                  <MdClose
                    onClick={() => props.setViewComment(false)}
                    style={{ fontSize: "2.5rem" }}
                  />
                </span>
              </div>
            </div>
          </AlignContent>
          {currentUser === "" ? (
            <div>
              <img src="" alt="" srcset="" />
              <h3>{currentUser.name}</h3>
              <textarea
                onChange={(e) => handleChangeInput(e)}
                placeholder="What are your thoughts?"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <button>Cancel</button>
              <button onClick={() => postComment()}>Respond</button>
            </div>
          ) : (
            <div
              style={{
                marginTop: "2rem",
                WebkitBoxShadow: "0px 0px 10px 1px rgba(220,220,220,0.9)",
                boxShadow: "0px 0px 10px 1px rgba(220,220,220,0.9)",
                padding: "5px 15px",
                width: "100%",
                height: "auto",
                borderRadius: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={
                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"
                  }
                  alt="Anonymous User"
                  style={{ width: "4rem", height: "4rem", marginRight: "5px" }}
                />
                <h3 style={{ marginLeft: "5px", fontSize: "1.5rem" }}>
                  Anonymous
                </h3>
              </div>
              <textarea
                onChange={(e) => handleChangeInput(e)}
                style={{ border: "none", paddingTop: "10px" }}
                placeholder="What are your thoughts?"
                name=""
                id=""
                cols="30"
                rows="10"
              ></textarea>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                  alignItems: "flex-end",
                }}
              >
                <button>Cancel</button>
                <button onClick={() => postComment()}>Respond</button>
              </div>
            </div>
          )}
          <select
            style={{
              border: "none",
              fontSize: "1.5rem",
              fontWeight: "700",
              paddingRight: "2px",
              marginTop: "2rem",
            }}
            name=""
            id=""
          >
            <option style={{ background: "blue" }} value="Relevant">
              Most Relevant
            </option>
            <option value="Recent">Most Recent</option>
          </select>
          <hr />
          {comments !== undefined && comments.comments.length !== 0 ? (
            <>
              {comments.comments.map((comment) => {
                const date1 = new Date();
                const date2 = new Date(comment.createdAt);
                const Difference_In_Time = date2.getTime() - date1.getTime();
                let Difference_In_Days = `${Math.round(
                  (Difference_In_Time / (1000 * 3600 * 24)) * -1
                )} days`;
                if (Difference_In_Days === "0 days")
                  Difference_In_Days = `${Math.round(
                    (Difference_In_Time / (1000 * 3600 * 24)) * -100
                  )} hours`;
                if (Difference_In_Days === "1 days")
                  Difference_In_Days = `${Math.round(
                    (Difference_In_Time / (1000 * 3600 * 24)) * -1
                  )} day`;
                return (
                  <div key={comment._id}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        style={{
                          width: "4rem",
                          height: "4rem",
                          marginRight: "5px",
                        }}
                        src={
                          comment.avatar ||
                          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"
                        }
                        alt={`${comment.name}-avatar`}
                      />
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <h3 style={{ fontSize: "1.6rem" }}>
                            {comment.name} &nbsp;
                            <span
                              style={{
                                backgroundColor: "green",
                                padding: "2px 5px",
                                fontSize: "1rem",
                                color: "white",
                              }}
                            >
                              AUTHOR
                            </span>
                          </h3>
                          <p>{Difference_In_Days} ago</p>
                        </div>
                        <div>
                          <BiDotsHorizontalRounded
                            style={{ fontSize: "2rem" }}
                          />
                        </div>
                      </div>
                    </div>
                    <div>{comment.comment}</div>
                    <div
                      style={{
                        paddingTop: "2rem",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <FaRegThumbsUp />
                      <button>Reply</button>
                    </div>
                  </div>
                );
              })}
            </>
          ) : (
            <>No Comments</>
          )}
        </StyledRightContainer>
      ) : (
        <StyledRightContainer className="d-none d-lg-block">
          <AlignContent Center>
            {!isLoggedIn ? (
              <>
                <Button size="large" onClick={() => handleClick("register")} backgroundColor="black" label="Get Started" />
                <ArticleLinkColor Green href="/login">
                  Sign In
                </ArticleLinkColor>
              </>
            ) : (
              <h2>Welcome, {user.name.split(" ")[0]}</h2>
            )}
          </AlignContent>
          <MarginTop RightCloumnSearch>
            <ArticleInput
              Search
              placeholder="Search"
              type="text"
              value={search}
              onChange={updateSearch}
            />
          </MarginTop>
          {
            isLoggedIn && (
              <>
                <SideUserContainer Primary>
                  <CircleImage
                    Secondary
                    src={
                      currentUser.avatar ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"
                    }
                    alt="author"
                  />
                  <UserInfo Padding4>{currentUser.name || "Will Smith"}</UserInfo>
                  <UserInfo GrayWPadding>119 Followers</UserInfo>
                  <UserInfo GrayWPadding>
                    Software Engineer | Python Programmer | Java Programmer | Tech
                    Enthusiast | JavaScript Programmer | React Lover | Mobile
                    Developer
                  </UserInfo>
                </SideUserContainer>
                <SideUserContainer ButtonGroup>
                  <Button size="small" backgroundColor="green" label="Follow" />
                  <Button
                    icon={<MdBookmarkBorder style={{ fontSize: "2rem", position: 'absolute', left: '66%',  top: '59%' }} />}
                    size="small"
                    backgroundColor="green"
                    shape={"round"}
                  />
                </SideUserContainer>
              </>
            )
          }
          <SideUserContainer Primary>
            <PostText>Related</PostText>
            {recentPosts.map((article) => {
              return (
                <div key={article._id}>
                  <PostContainer>
                    <SquareImage src={article.images.url} alt="post" />
                    <SideUserContainer>
                      <Link
                        to={`/blog/${article._id}`}
                        rel="noopener noreferrer"
                      >
                        <h5>{article.title}</h5>
                      </Link>
                      <Subtitle Primary> {article.subtitle}</Subtitle>
                    </SideUserContainer>
                  </PostContainer>
                  <br />
                </div>
              );
            })}
          </SideUserContainer>
          <PageLinks>
            <ArticleLink href="#">Help</ArticleLink>
            {/* <ArticleLink href="#">Status</ArticleLink> */}
            {/* <ArticleLink href="#">Writers</ArticleLink> */}
            <ArticleLink href="/blog">Blog</ArticleLink>
            {/* <ArticleLink href="#">Careers</ArticleLink> */}
            <ArticleLink href="#">Privacy</ArticleLink>
            <ArticleLink href="#">Terms</ArticleLink>
            {/* <ArticleLink href="#">About</ArticleLink> */}
          </PageLinks>
        </StyledRightContainer>
      )}
    </>
  );
}


export default RightColumn;
