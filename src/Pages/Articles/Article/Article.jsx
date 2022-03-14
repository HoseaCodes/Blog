import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { GlobalState } from '../../../GlobalState';
import '../Articles.css'
import marked from 'marked';
import moment from 'moment-timezone'
import Alert from 'react-bootstrap/Alert'
import { AiFillStar, AiFillPlayCircle, AiFillTwitterCircle, AiOutlineMail } from 'react-icons/ai';
import {FaRegThumbsUp, FaRegComment, FaFacebook} from 'react-icons/fa';
import {TiSocialLinkedinCircular} from 'react-icons/ti';
import {HiOutlinePencilAlt} from 'react-icons/hi';
import {BsHouseDoor, BsBell} from 'react-icons/bs';
import {MdBookmarkBorder} from 'react-icons/md';
import {RiShareCircleFill} from 'react-icons/ri';
import Sticky from 'react-sticky-state';
import logo from '../../../Assets/Images/newLogo.png';
import {StyledLeftContainer, JustifyContent, StyledMainContainer,
  PaddingContent, PageLinks} from '../../../Layout/Container/styledArticle';
import {CircleImage, LogoImage, SquareImage} from '../../../Layout/Image/styledImage';
import {StackedAlignn} from '../../../Layout/Icon/styledIcons';
import {ArticleHr} from '../../../Layout/Hr/styledHr';
import {AlertP} from '../../../Layout/Paragraph/styledParagraph';
import {AlertLink, ArticleLink} from '../../../Layout/ATag/styledATag';
import {NamePlate, WarppedDate, GrayText, DisplayItem} from '../../../Layout/Text/styledText';

const ArticleItem = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [articles] = state.articlesAPI.articles
    const [detailArticle, setdetailArticle] = useState([])

    useEffect(() => {
        if (params.id) {
            articles.forEach(article => {
                if (article._id === params.id) setdetailArticle(article)
            })
        }
    }, [params.id, articles])

    if (detailArticle.length === 0) return null;

    const { title, subtitle, createdAt, description, images, markdown } = detailArticle;

    const timeFormater = moment.utc(createdAt).format('MMMM Do YYYY')
    const avgWordsMinRead = 238
    const wordCount = markdown.length + 700
    const readTime = Math.round(wordCount / avgWordsMinRead)

    return (
        <>
            <main className="blog-content">
              <StyledLeftContainer>
                <JustifyContent >
                  <LogoImage src={logo} alt="logo"/>
                </JustifyContent>
                <StackedAlignn >
                  <BsHouseDoor style={{marginBottom: '5rem'}}/>
                  <BsBell style={{marginBottom: '5rem'}}/>
                  <MdBookmarkBorder style={{marginBottom: '5rem'}}/>
                  <ArticleHr/>
                  <HiOutlinePencilAlt style={{marginBottom: '5rem'}}/>
                </StackedAlignn>
              </StyledLeftContainer>
              <StyledMainContainer>
                <PaddingContent>
                  <section>
                    <Alert transition="false" variant="light">
                      <AlertP>
                              You have <strong style={{ color: 'black' }}>1</strong> free member-only story left this month.&nbsp;
                        <AlertLink href="#">Sign up for Medium and get an extra one.</AlertLink>
                      </AlertP>
                    </Alert>
                    <JustifyContent AlignCenter>
                      <CircleImage src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                            alt="author" />
                      <div>
                        <NamePlate>Will Smith</NamePlate>
                        <WarppedDate>
                          <GrayText>{timeFormater}</GrayText>
                          <span>&nbsp;&#183;&nbsp;</span>
                          <DisplayItem>{readTime} min read &nbsp; <AiFillStar/></DisplayItem>
                          <span>&nbsp;&#183;&nbsp;</span>
                          <DisplayItem Green><AiFillPlayCircle style={{fontSize: 'larger'}}/> &nbsp; Listen</DisplayItem>
                        </WarppedDate>
                      </div>
                    </JustifyContent>
                    <ArticleHr Primary/>
                    <h2 className='blog-title'>{title}</h2>
                    <h3 className='blog-title' style={{ color: 'dimgray', fontSize: '2.5rem'}}>{subtitle}</h3>
                      <img className='blog-img' src={images.url} alt={title}  />
                      <p style={{ display: 'flex', justifyContent: 'center', color: 'dimgray' }}>Photo Credit by <u>You</u></p>
                      <section className='blog-card'>
                        <br />
                        <section className='blog-post'>
                        <br />
                        <p className='blog-content-info'>{description}</p>
                        <br />
                        <br />
                        <p className='blog-content-info'  dangerouslySetInnerHTML={{ __html: marked(markdown) }}></p>
                        <br />
                        <Sticky >
                          <div  className="bottom sticky">
                            <ArticleHr Primary/>
                            <div style={{ display: 'flex', justifyContent: 'space-between'}}>
                              <div style={{ display: 'flex',  justifyContent: 'center', fontSize: '2rem'}}>
                                <div style={{ display: 'flex',  alignItems: 'center', marginRight: '4%' }}>
                                  <FaRegThumbsUp/> &nbsp; <span>1</span>
                                </div>
                                <div  style={{ display: 'flex',  alignItems: 'center', marginRight: '4%' }}>
                                  <FaRegComment/> &nbsp; <span>1</span>
                                </div>
                              </div>
                              <div style={{fontSize: '2.5rem'}}>
                                <FaFacebook/>
                                <AiFillTwitterCircle/>
                                <TiSocialLinkedinCircular/>
                                <RiShareCircleFill/>
                                <MdBookmarkBorder/>
                              </div>
                            </div>
                          </div>
                        </Sticky>
                        <div style={{backgroundColor: 'whitesmoke', padding: '4%', marginTop: '8%', borderTop: 'solid', borderColor: 'green'}}>
                          <div>
                            <h3>Sign up for Software Engineering News</h3>
                            <p style={{fontSize: '1.5rem', paddingBottom: '1.5%'}}>By Dominique Hosea</p>
                            <p style={{fontSize: '1.8rem', width: '80%'}}>Latest news from Analytics Vidhya on our Hackathons and some of our best articles!&nbsp;
                              <u>Take a look.</u>
                            </p>
                            <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 6% 0 0'}}>
                              <input placeholder='Your email' type="text"
                              style={{background: 'transparent', border: 'none', borderBottom: 'solid', width: '60%',
                                      fontSize: '1.5rem'}} />
                              <button style={{background: 'green', padding: '1.5% 3%', borderRadius: '60px',
                                              color: 'white', fontSize: '1.8rem', display: 'flex',  alignItems: 'center'}}><AiOutlineMail style={{fontSize: '2.5rem'}}/>&nbsp;  Get this newsletter</button>
                            </div>
                            <div style={{marginTop: '4%'}}>By signing up, you will create a Medium account if you don"’"t already have one.
                              Review our Privacy Policy for more information about our privacy practices.</div>
                          </div>
                        </div>
                                </section>
                                {/* <input type="checkbox" checked={checked}
                                    onChange={() => props.handleCheck(_id)} /> */}
                                    {/* <BtnRender article={props.article} deleteArticle={props.deleteArticle} /> */}
                            </section>
                        </section>
                </PaddingContent>
                    <div style={{ marginTop: '4%', background: 'whitesmoke'}}>
                      <div style={{display: 'flex', flexDirection: 'column', padding: '6%', width: '100%'}}>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                          <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                                    alt="author" style={{borderRadius: '50%', height: 'auto', width:'45px', marginRight: '4%'}} />
                          <div style={{padding: "4% 0", fontSize: '1.8rem'}}>Will Smith</div>
                          <span>&nbsp;&#183;&nbsp;</span>
                          <div style={{color: 'dimgray'}}>{timeFormater}</div>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center'}}>
                            <div>
                              <h4> No Code Approach — Process Speech and convert to Text — Logic Apps</h4>
                              <p> Using Azure Cognitive Services Speech to Text and Logic apps No Code — Workflow style
                                  We can re use the same pattern for other Azure Cognitive...
                              </p>
                            </div>
                            <img height={'100px'} width={'150px'} src={"https://tateeda.com/wp-content/uploads/2020/05/2.png"} alt="post"/>
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '80%', marginTop: '4%'}}>
                          <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row'}}>
                            <div style={{background: 'gray', borderRadius: '20px', textAlign: 'center', padding: '1%', marginRight:'2%'}}>Software</div>
                              <div style={{display: 'flex', alignItems: 'center', color: 'dimgray'}}><span>{readTime} min read</span></div>
                            </div>
                            <MdBookmarkBorder style={{fontSize: '2.5rem'}}/>
                          </div>
                      </div>
                        <hr style={{color: 'green', background: 'slategrey', width: '90%', height: '2px'}}/>
                        <div style={{display: 'flex', flexDirection: 'column', padding: '6%', width: '100%'}}>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                                      alt="author" style={{borderRadius: '50%', height: 'auto', width:'45px', marginRight: '4%'}} />
                            <div style={{padding: "4% 0", fontSize: '1.8rem'}}>Will Smith</div>
                            <span>&nbsp;&#183;&nbsp;</span>
                            <div style={{color: 'dimgray'}}>{timeFormater}</div>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center'}}>
                            <div>
                              <h4> No Code Approach — Process Speech and convert to Text — Logic Apps</h4>
                              <p> Using Azure Cognitive Services Speech to Text and Logic apps No Code — Workflow style
                                  We can re use the same pattern for other Azure Cognitive...
                              </p>
                            </div>
                            <img height={'100px'} width={'150px'} src={"https://tateeda.com/wp-content/uploads/2020/05/2.png"} alt="post"/>
                          </div>
                          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '80%', marginTop: '4%'}}>
                            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'row', width: 'inherit'}}>
                                <div style={{background: 'gray', borderRadius: '20px', textAlign: 'center', padding: '1%', marginRight:'2%'}}>Software</div>
                                <div style={{display: 'flex', alignItems: 'center', color: 'dimgray'}}><span>{readTime} min read</span></div>
                            </div>
                            <MdBookmarkBorder style={{fontSize: '2.5rem'}}/>
                          </div>
                      </div>
                      <hr style={{color: 'green', background: 'slategrey', width: '90%', height: '2px'}}/>
                      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '16%'}}>
                        <button style={{marginTop: '8%', textAlign: 'center', background: 'green', color: 'white', borderRadius: "20px", padding: '1.5% 3%'}}>Read more from me</button>
                      </div>
                    </div>
              </StyledMainContainer>
              <div style={{width: '45rem', padding: '4% 2% 0% 2%', border: '1px solid #ccc', margin: '0',
                          maxHeight: 'calc(105vh - 4rem)', overflowY: 'scroll', position: 'sticky', top: '0',
                          right: '0'}}>
                <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between',
                            marginRight: '12%', alignItems: 'center'}}>
                  <button style={{display: 'flex', flexDirection: 'column', background: 'black', padding: '1.5% 15%', borderRadius: '60px',
                                color: 'white', fontSize: '1.8rem',  alignItems: 'center'}}>Get Started</button>
                  <a href='#' style={{color: 'green'}}>Sign In</a>
                </div>
                <div style={{display: 'flex', marginTop: '12%', }}>
                  <input placeholder='Search' type="text"
                        style={{background: 'transparent', width: '90%',
                        fontSize: '1.5rem', padding: '2% 8%', borderRadius: '20px'}} />
                </div>
                <div style={{display: 'flex', flexDirection: 'column',marginTop: '12%', }}>
                  <img src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0k6I8WItSjK0JTttL3FwACOA6yugI29xvLw&usqp=CAU"}
                            alt="author" style={{borderRadius: '50%', height: 'auto', width:'85px', marginRight: '4%'}} />
                  <div style={{padding: "4% 0 0 0", fontSize: '1.8rem'}}>Will Smith</div>
                  <div style={{fontSize: '1.4rem', color: 'dimgray'}}>119 Followers</div>
                  <div style={{padding: "4% 0 0 0", fontSize: '1.4rem', color: 'dimgray'}}>
                    Software Engineer | Python Programmer | Java Programmer | Tech Enthusiast | JavaScript Programmer | React Lover | Mobile Developer</div>
                </div>
                <div  style={{display: 'flex', flexDirection: 'row', marginTop: '8%', }}>
                  <button style={{display: 'flex', flexDirection: 'column', background: 'green', padding: '1.5% 4%', borderRadius: '60px',
                                  color: 'white', fontSize: '1.5rem',  alignItems: 'center', marginRight: '2%'}}>Follow</button>
                  <button style={{display: 'flex', flexDirection: 'column', background: 'green', padding: '1.5% 4%', borderRadius: '50%',
                                  color: 'white', fontSize: '1.5rem',  alignItems: 'center'}}><MdBookmarkBorder style={{fontSize: '2rem'}}/></button>
                </div>
                <div  style={{display: 'flex', flexDirection: 'column', marginTop: '12%', }}>
                  <p style={{fontSize: '1.8rem', fontWeight: '500'}}>Related</p>
                  <div style={{display: 'flex', flexDirection: 'row', marginTop: '5%'}}>
                    <SquareImage src={"https://okteto.com/static/ac268f62ae1c1edd1802a3b841bf2c5a/cover.png"}
                            alt="post" />
                    <div style={{display: 'flex', flexDirection: 'column' }}>
                      <h5>FastAPI: Complete API Development</h5>
                      <h6 style={{color: 'dimgray'}}> FastAPI: Complete API Development</h6>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', marginTop: '15%' }}>
                    <SquareImage src={"https://makeameme.org/media/templates/250/dr_evil_austin_powers.jpg"}
                            alt="post" />
                    <div style={{display: 'flex', flexDirection: 'column' }}>
                      <h5 style={{margin: '0'}}>Handling MongoDb ObjectId in Python FastAPI</h5>
                      <h6 style={{color: 'dimgray', margin: '2% 0 0 0'}}> Keep it simlpe but significant</h6>
                    </div>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'row', marginTop: '15%' }}>
                    <SquareImage src={"https://miro.medium.com/max/1200/1*OdqgwkO9B5A29LP9Vb9rHQ.png"}
                            alt="post" />
                    <div style={{display: 'flex', flexDirection: 'column' }}>
                      <h5 style={{margin: '0'}}>Pydantic — Better Data Validation for Python</h5>
                      <h6 style={{color: 'dimgray', margin: '2% 0 0 0'}}> “Data validation and settings management using Python type hinting."</h6>
                    </div>
                  </div>
                </div>
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
              </div>
            </main>
        </>
    )
}

export default ArticleItem;
