import React, { useContext, useState, useEffect } from "react";
import styled from 'styled-components';
import { Link, useHistory, useParams } from "react-router-dom";
import { GlobalState } from "../../GlobalState";
import { MdBookmarkBorder, MdClose } from "react-icons/md";
import { FaRegThumbsUp } from "react-icons/fa";
import { BiCheckShield, BiDotsHorizontalRounded } from "react-icons/bi";
import axios from "axios";

// =============================================
// MEDIUM DESIGN TOKENS
// =============================================
const mediumTheme = {
  colors: {
    text: {
      primary: '#242424',
      secondary: '#6b6b6b',
      light: '#8b8b8b'
    },
    background: {
      white: '#ffffff',
      light: '#fafafa',
      border: '#e6e6e6',
      hover: '#f2f2f2'
    },
    accent: {
      green: '#1a8917',
      lightGreen: '#f0fff0'
    }
  },
  typography: {
    fontFamily: {
      serif: 'charter, Georgia, Cambria, "Times New Roman", Times, serif',
      sansSerif: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif'
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '21px',
      '2xl': '28px'
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6
    }
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },
  breakpoints: {
    tablet: '1024px'
  }
};

// =============================================
// STYLED COMPONENTS
// =============================================
const StyledRightContainer = styled.aside`
  width: 300px;
  padding: ${mediumTheme.spacing['2xl']} ${mediumTheme.spacing.lg} 0;
  border-left: 1px solid ${mediumTheme.colors.background.border};
  background: ${mediumTheme.colors.background.white};
  height: 100vh;
  overflow-y: auto;
  position: sticky;
  top: 0;
  align-self: flex-start;
  z-index: 10;

  @media (max-width: ${mediumTheme.breakpoints.tablet}) {
    display: none;
  }

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${mediumTheme.colors.background.light};
  }

  &::-webkit-scrollbar-thumb {
    background: ${mediumTheme.colors.background.border};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${mediumTheme.colors.text.light};
  }
`;

const AlignContent = styled.div`
  display: flex;
  flex-direction: ${props => props.column ? 'column' : 'row'};
  align-items: ${props => props.center ? 'center' : 'flex-start'};
  justify-content: ${props => props.center ? 'center' : 'flex-start'};
  gap: ${mediumTheme.spacing.md};
  margin-bottom: ${props => props.noMargin ? '0' : mediumTheme.spacing.xl};
  text-align: ${props => props.center ? 'center' : 'left'};
`;

const WelcomeSection = styled.div`
  text-align: center;
  margin-bottom: ${mediumTheme.spacing.xl};
  
  h2 {
    font-size: ${mediumTheme.typography.fontSize.xl};
    font-weight: ${mediumTheme.typography.fontWeight.medium};
    color: ${mediumTheme.colors.text.primary};
    margin-bottom: ${mediumTheme.spacing.md};
  }
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? mediumTheme.colors.accent.green : 'transparent'};
  color: ${props => props.primary ? 'white' : mediumTheme.colors.accent.green};
  border: 1px solid ${mediumTheme.colors.accent.green};
  padding: ${mediumTheme.spacing.sm} ${mediumTheme.spacing.xl};
  border-radius: 20px;
  font-size: ${mediumTheme.typography.fontSize.sm};
  font-weight: ${mediumTheme.typography.fontWeight.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-block;
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};

  &:hover {
    background-color: ${props => props.primary ? '#0f6b14' : mediumTheme.colors.accent.lightGreen};
    transform: translateY(-1px);
  }

  &:focus {
    outline: 2px solid ${mediumTheme.colors.accent.green};
    outline-offset: 2px;
  }
`;

const SignInLink = styled(Link)`
  color: ${mediumTheme.colors.accent.green};
  text-decoration: none;
  font-size: ${mediumTheme.typography.fontSize.sm};
  font-weight: ${mediumTheme.typography.fontWeight.medium};

  &:hover {
    text-decoration: underline;
  }
`;

const SearchContainer = styled.div`
  margin-bottom: ${mediumTheme.spacing.xl};
`;

const SearchInput = styled.input`
  width: 100%;
  padding: ${mediumTheme.spacing.sm} ${mediumTheme.spacing.md};
  border: 1px solid ${mediumTheme.colors.background.border};
  border-radius: 20px;
  font-size: ${mediumTheme.typography.fontSize.sm};
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};
  background-color: ${mediumTheme.colors.background.light};
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${mediumTheme.colors.accent.green};
    background-color: ${mediumTheme.colors.background.white};
    box-shadow: 0 0 0 3px ${mediumTheme.colors.accent.lightGreen};
  }

  &::placeholder {
    color: ${mediumTheme.colors.text.light};
  }
`;

const UserCard = styled.div`
  background: ${mediumTheme.colors.background.white};
  border: 1px solid ${mediumTheme.colors.background.border};
  border-radius: 8px;
  padding: ${mediumTheme.spacing.lg};
  margin-bottom: ${mediumTheme.spacing.lg};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const UserAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: ${mediumTheme.spacing.sm};
`;

const UserName = styled.div`
  font-size: ${mediumTheme.typography.fontSize.base};
  font-weight: ${mediumTheme.typography.fontWeight.medium};
  color: ${mediumTheme.colors.text.primary};
  margin-bottom: ${mediumTheme.spacing.xs};
`;

const UserStats = styled.div`
  font-size: ${mediumTheme.typography.fontSize.sm};
  color: ${mediumTheme.colors.text.secondary};
  margin-bottom: ${mediumTheme.spacing.sm};
`;

const UserBio = styled.div`
  font-size: ${mediumTheme.typography.fontSize.sm};
  color: ${mediumTheme.colors.text.secondary};
  line-height: ${mediumTheme.typography.lineHeight.relaxed};
  margin-bottom: ${mediumTheme.spacing.md};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${mediumTheme.spacing.sm};
  align-items: center;
`;

const BookmarkButton = styled.button`
  background: none;
  border: 1px solid ${mediumTheme.colors.background.border};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${mediumTheme.colors.text.secondary};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${mediumTheme.colors.background.hover};
    border-color: ${mediumTheme.colors.accent.green};
    color: ${mediumTheme.colors.accent.green};
  }

  svg {
    font-size: 18px;
  }
`;

const RelatedSection = styled.div`
  margin-bottom: ${mediumTheme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${mediumTheme.typography.fontSize.lg};
  font-weight: ${mediumTheme.typography.fontWeight.semibold};
  color: ${mediumTheme.colors.text.primary};
  margin-bottom: ${mediumTheme.spacing.lg};
  font-family: ${mediumTheme.typography.fontFamily.sansSerif};
`;

const RelatedArticle = styled.div`
  display: flex;
  gap: ${mediumTheme.spacing.md};
  margin-bottom: ${mediumTheme.spacing.lg};
  cursor: pointer;
  transition: opacity 0.2s ease;
  
  &:hover {
    opacity: 0.8;
  }

  &:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
`;

const ArticleImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
`;

const ArticleInfo = styled.div`
  flex: 1;
  
  h5 {
    font-size: ${mediumTheme.typography.fontSize.base};
    font-weight: ${mediumTheme.typography.fontWeight.medium};
    line-height: ${mediumTheme.typography.lineHeight.normal};
    margin-bottom: ${mediumTheme.spacing.xs};
    color: ${mediumTheme.colors.text.primary};
    font-family: ${mediumTheme.typography.fontFamily.sansSerif};
  }
`;

const ArticleSubtitle = styled.p`
  font-size: ${mediumTheme.typography.fontSize.sm};
  color: ${mediumTheme.colors.text.secondary};
  line-height: ${mediumTheme.typography.lineHeight.relaxed};
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FooterLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${mediumTheme.spacing.md};
  margin-top: ${mediumTheme.spacing.xl};
  padding-top: ${mediumTheme.spacing.lg};
  border-top: 1px solid ${mediumTheme.colors.background.border};
  
  a {
    font-size: ${mediumTheme.typography.fontSize.sm};
    color: ${mediumTheme.colors.text.light};
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: ${mediumTheme.colors.text.secondary};
    }
  }
`;

// Comments Section Styles
const CommentsSection = styled.div`
  background: ${mediumTheme.colors.background.white};
  border-radius: 8px;
  padding: ${mediumTheme.spacing.lg};
  margin-bottom: ${mediumTheme.spacing.lg};
`;

const CommentsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${mediumTheme.spacing.lg};
  
  h4 {
    margin: 0;
    font-size: ${mediumTheme.typography.fontSize.lg};
    font-weight: ${mediumTheme.typography.fontWeight.semibold};
    color: ${mediumTheme.colors.text.primary};
  }
  
  .actions {
    display: flex;
    gap: ${mediumTheme.spacing.sm};
    align-items: center;
    
    svg {
      font-size: 20px;
      cursor: pointer;
      color: ${mediumTheme.colors.text.secondary};
      transition: color 0.2s ease;
      
      &:hover {
        color: ${mediumTheme.colors.text.primary};
      }
    }
  }
`;

const CommentForm = styled.div`
  border: 1px solid ${mediumTheme.colors.background.border};
  border-radius: 8px;
  padding: ${mediumTheme.spacing.lg};
  margin-bottom: ${mediumTheme.spacing.lg};
  background: ${mediumTheme.colors.background.light};
  
  .user-info {
    display: flex;
    align-items: center;
    gap: ${mediumTheme.spacing.sm};
    margin-bottom: ${mediumTheme.spacing.md};
    
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    h3 {
      font-size: ${mediumTheme.typography.fontSize.base};
      font-weight: ${mediumTheme.typography.fontWeight.medium};
      margin: 0;
      color: ${mediumTheme.colors.text.primary};
    }
  }
  
  textarea {
    width: 100%;
    border: none;
    background: transparent;
    font-family: ${mediumTheme.typography.fontFamily.sansSerif};
    font-size: ${mediumTheme.typography.fontSize.base};
    line-height: ${mediumTheme.typography.lineHeight.relaxed};
    resize: vertical;
    min-height: 100px;
    color: ${mediumTheme.colors.text.primary};
    
    &:focus {
      outline: none;
    }
    
    &::placeholder {
      color: ${mediumTheme.colors.text.light};
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: ${mediumTheme.spacing.sm};
    padding-top: ${mediumTheme.spacing.md};
    
    button {
      padding: ${mediumTheme.spacing.sm} ${mediumTheme.spacing.lg};
      border-radius: 20px;
      border: none;
      cursor: pointer;
      font-size: ${mediumTheme.typography.fontSize.sm};
      font-weight: ${mediumTheme.typography.fontWeight.medium};
      transition: all 0.2s ease;
      
      &.cancel {
        background: none;
        color: ${mediumTheme.colors.text.secondary};
        
        &:hover {
          background: ${mediumTheme.colors.background.hover};
        }
      }
      
      &.submit {
        background-color: ${mediumTheme.colors.accent.green};
        color: white;
        
        &:hover {
          background-color: #0f6b14;
        }
      }
    }
  }
`;

const CommentSortSelector = styled.select`
  border: none;
  background: none;
  font-size: ${mediumTheme.typography.fontSize.base};
  font-weight: ${mediumTheme.typography.fontWeight.semibold};
  color: ${mediumTheme.colors.text.primary};
  margin-bottom: ${mediumTheme.spacing.md};
  cursor: pointer;
  
  &:focus {
    outline: none;
  }
`;

const CommentItem = styled.div`
  padding: ${mediumTheme.spacing.lg} 0;
  border-bottom: 1px solid ${mediumTheme.colors.background.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  .comment-header {
    display: flex;
    align-items: center;
    gap: ${mediumTheme.spacing.sm};
    margin-bottom: ${mediumTheme.spacing.sm};
    
    img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    
    .info {
      flex: 1;
      
      h3 {
        font-size: ${mediumTheme.typography.fontSize.base};
        font-weight: ${mediumTheme.typography.fontWeight.medium};
        margin: 0;
        display: flex;
        align-items: center;
        gap: ${mediumTheme.spacing.sm};
        color: ${mediumTheme.colors.text.primary};
        
        .author-badge {
          background-color: ${mediumTheme.colors.accent.green};
          color: white;
          font-size: ${mediumTheme.typography.fontSize.xs};
          padding: 2px 6px;
          border-radius: 3px;
          font-weight: ${mediumTheme.typography.fontWeight.medium};
        }
      }
      
      p {
        margin: 0;
        font-size: ${mediumTheme.typography.fontSize.sm};
        color: ${mediumTheme.colors.text.secondary};
      }
    }
    
    svg {
      font-size: 20px;
      cursor: pointer;
      color: ${mediumTheme.colors.text.secondary};
      
      &:hover {
        color: ${mediumTheme.colors.text.primary};
      }
    }
  }
  
  .comment-content {
    margin-bottom: ${mediumTheme.spacing.md};
    line-height: ${mediumTheme.typography.lineHeight.relaxed};
    color: ${mediumTheme.colors.text.primary};
  }
  
  .comment-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    svg {
      cursor: pointer;
      color: ${mediumTheme.colors.text.secondary};
      
      &:hover {
        color: ${mediumTheme.colors.accent.green};
      }
    }
    
    button {
      background: none;
      border: none;
      color: ${mediumTheme.colors.text.secondary};
      font-size: ${mediumTheme.typography.fontSize.sm};
      cursor: pointer;
      
      &:hover {
        color: ${mediumTheme.colors.text.primary};
      }
    }
  }
`;

const NoCommentsMessage = styled.p`
  text-align: center;
  color: ${mediumTheme.colors.text.secondary};
  font-style: italic;
  padding: ${mediumTheme.spacing.xl} 0;
`;

// =============================================
// MAIN COMPONENT
// =============================================
const RightColumn = ({ user, articles, viewComment, setViewComment }) => {
  const history = useHistory();
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [currentUser, setCurrentUser] = useState(user);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [search, setSearch] = useState("");
  const [comments, setComments] = useState({ comments: [] });
  const [comment, setComment] = useState("");
  
  const param = useParams();

  const shuffleArray = (arr) => arr.sort(() => 0.5 - Math.random());
  
  const recentPosts = shuffleArray([...articles])
    .filter((article) => {
      if (article._id === param.id) return false;
      return article.title.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    })
    .slice(0, 5);

  const updateSearch = (event) => {
    const { value } = event.target;
    setSearch(value.substr(0, 20));
  };

  const handleClick = (path) => {
    history.push(`/${path}`);
  };

  // Comments functionality
  useEffect(() => {
    if (param.id) {
      const getComments = async () => {
        try {
          const res = await axios.get(`/api/articles/${param.id}/comments`);
          const filteredComments = res.data.comments.filter((comment) => 
            comment.blog === param.id
          );
          setComments({ comments: filteredComments });
          
          await axios.put(`/api/articles/${param.id}`, {
            comments: filteredComments,
          }, {
            headers: { Authorization: token },
          });
        } catch (err) {
          console.error('Error fetching comments:', err);
        }
      };
      getComments();
    }
  }, [param.id, comment, token]);

  const postComment = async () => {
    if (!comment.trim()) return;
    
    try {
      await axios.post(`/api/articles/${param.id}/comments`, {
        postId: param.id,
        comment,
        user,
      });
      
      const res = await axios.get(`/api/articles/${param.id}/comments`);
      const filteredComments = res.data.comments.filter((comment) => 
        comment.blog === param.id
      );
      setComments({ comments: filteredComments });

      await axios.put(`/api/articles/${param.id}`, {
        comments: filteredComments,
      }, {
        headers: { Authorization: token },
      });
      
      setComment("");
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handleChangeInput = (e) => {
    setComment(e.target.value);
  };

  return (
    <StyledRightContainer>
      {viewComment ? (
        <>
          <CommentsSection>
            <CommentsHeader>
              <h4>Responses ({comments.comments.length})</h4>
              <div className="actions">
                <BiCheckShield />
                <BiDotsHorizontalRounded />
                <MdClose onClick={() => setViewComment(false)} />
              </div>
            </CommentsHeader>

            <CommentForm>
              <div className="user-info">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"
                  alt="Anonymous User"
                />
                <h3>Anonymous</h3>
              </div>
              <textarea
                value={comment}
                onChange={handleChangeInput}
                placeholder="What are your thoughts?"
                rows="4"
              />
              <div className="actions">
                <button className="cancel" onClick={() => setComment("")}>
                  Cancel
                </button>
                <button className="submit" onClick={postComment}>
                  Respond
                </button>
              </div>
            </CommentForm>

            <CommentSortSelector>
              <option value="Relevant">Most Relevant</option>
              <option value="Recent">Most Recent</option>
            </CommentSortSelector>

            {comments.comments.length > 0 ? (
              comments.comments.map((comment) => {
                const date1 = new Date();
                const date2 = new Date(comment.createdAt);
                const timeDiff = Math.round((date1.getTime() - date2.getTime()) / (1000 * 3600 * 24));
                const timeAgo = timeDiff === 0 ? 'Today' : 
                               timeDiff === 1 ? '1 day ago' : 
                               `${timeDiff} days ago`;

                return (
                  <CommentItem key={comment._id}>
                    <div className="comment-header">
                      <img
                        src={comment.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                        alt={`${comment.name}-avatar`}
                      />
                      <div className="info">
                        <h3>
                          {comment.name}
                          <span className="author-badge">AUTHOR</span>
                        </h3>
                        <p>{timeAgo}</p>
                      </div>
                      <BiDotsHorizontalRounded />
                    </div>
                    <div className="comment-content">{comment.comment}</div>
                    <div className="comment-actions">
                      <FaRegThumbsUp />
                      <button>Reply</button>
                    </div>
                  </CommentItem>
                );
              })
            ) : (
              <NoCommentsMessage>No Comments</NoCommentsMessage>
            )}
          </CommentsSection>
        </>
      ) : (
        <>
          <AlignContent center>
            {!isLoggedIn ? (
              <>
                <ActionButton primary onClick={() => handleClick("register")}>
                  Get Started
                </ActionButton>
                <SignInLink to="/login">Sign In</SignInLink>
              </>
            ) : (
              <WelcomeSection>
                <h2>Welcome, {user.name?.split(" ")[0]}</h2>
              </WelcomeSection>
            )}
          </AlignContent>

          <SearchContainer>
            <SearchInput
              placeholder="Search"
              type="text"
              value={search}
              onChange={updateSearch}
            />
          </SearchContainer>

          {isLoggedIn && (
            <>
              <UserCard>
                <UserAvatar
                  src={currentUser.avatar || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                  alt="author"
                />
                <UserName>{currentUser.name || "Will Smith"}</UserName>
                <UserStats>119 Followers</UserStats>
                <UserBio>
                  Software Engineer | Python Programmer | Java Programmer | Tech
                  Enthusiast | JavaScript Programmer | React Lover | Mobile
                  Developer
                </UserBio>
                <ButtonGroup>
                  <ActionButton primary>Follow</ActionButton>
                  <BookmarkButton>
                    <MdBookmarkBorder />
                  </BookmarkButton>
                </ButtonGroup>
              </UserCard>
            </>
          )}

          <RelatedSection>
            <SectionTitle>Related</SectionTitle>
            {recentPosts.map((article) => (
              <RelatedArticle key={article._id}>
                <ArticleImage src={article.images?.url} alt="post" />
                <ArticleInfo>
                  <Link
                    to={`/blog/${article._id}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <h5>{article.title}</h5>
                  </Link>
                  <ArticleSubtitle>
                    {article.subtitle || article.description}
                  </ArticleSubtitle>
                </ArticleInfo>
              </RelatedArticle>
            ))}
          </RelatedSection>

          <FooterLinks>
            <a href="#">Help</a>
            <a href="/blog">Blog</a>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </FooterLinks>
        </>
      )}
    </StyledRightContainer>
  );
};

export default RightColumn;