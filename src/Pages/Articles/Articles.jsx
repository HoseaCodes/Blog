
import React, { useState, useContext } from 'react';
import './Articles.css'
import NavBar from '../../Components/NavBar/NavBar';
import Subscribe from '../../Components/Subscribe/Subscribe'
// import { articleData, categoryTags } from './ArticleData';
import ArticleCard from './ArticleCard';
// import { auth, login, logout } from '../../services/firebase';
import { GlobalState } from '../../GlobalState';
import Loading from '../../Loading';
import axios from 'axios';
import Footer from '../../Components/Footer/Footer';
import Pagination from '../../Components/Pagination/pagination';

const Articles = () => {

    const state = useContext(GlobalState)
    const [articles, setArticles] = state.articlesAPI.articles
    // const [token] = state.token
    const [callback, setCallback] = state.articlesAPI.callback
    const [loading, setLoading] = useState(false)
    const [tagsShow, setTagsShow] = useState('All')
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('active')
    const [currentPage, setCurrentPage] = useState(1)
    const [postsPerPage] = useState(3)

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = articles.slice(indexOfFirstPost, indexOfLastPost)
    
    const paginate = pageNum => setCurrentPage(pageNum);
    const nextPage = () => {
        if (currentPage > articles.length) return;
        setSearch('')
        setCurrentPage(currentPage + 1);
    } 
    const prevPage = () => {
        if (currentPage < 1) return;
        setSearch('')
        setCurrentPage(currentPage - 1);
    }

    const deleteArticle = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destory', { public_id })
            const deleteArticle = axios.delete(`/api/articles/${id}`)
            await destroyImg
            await deleteArticle
            setLoading(false)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleCheck = async (id) => {
        articles.forEach(article => {
            if (article._id === id) article.checked = !article.checked
        })
        setArticles([...articles])
    }

    const filteredArticles = currentPosts.filter(
        (article) => {
            return article.title.toLowerCase().indexOf(
                search.toLowerCase()) !== -1;
        }
    );

    const updateSearch = event => {
        const { value } = event.target
        setSearch(value.substr(0, 20))
    }

    const updateItemsShow = (str) => {
        setTagsShow(str)
        setStatus("active")
    }

    let taggedArticles = []
    if (tagsShow === "All") {
        taggedArticles = filteredArticles
    }
    else if (tagsShow === "JavaScript") {
        taggedArticles = filteredArticles.filter(item => item.type.includes("JavaScript"))
    }
    else if (tagsShow === "Python") {
        taggedArticles = filteredArticles.filter(item => item.type.includes("Python"))
    }
    else if (tagsShow === "Software Engineer") {
        taggedArticles = filteredArticles.filter(item => item.type.includes("Software Engineer"))
    }

    if (loading) return <div className="products"><Loading /></div>
    return (
        <>
            <div className='article-container'>
                <NavBar />
                <div className='article-header'>
                    <div className='artcile-header-logo'>
                    </div>
                </div>
                <hr className="header-hr "/>
                <div id="articles">
                    <h3 className='articles-header'>Thoughts of a Wise Mind<hr /></h3>
                    <p style={{ fontSize: '1.5rem', color: 'lightgray' }}>Here are some of my articles you may like.</p>
                    <input type="text"
                        className='article-search'
                        label="Search Articles"
                        placeholder="Find a Post"
                        value={search}
                        onChange={updateSearch}
                    />
                    <div className="article-box">

                        {/* <!--───────────────Tabs───────────────--> */}

                        <section id="tabs">
                            <div className="row">
                                <div className="col">
                                    <nav>
                                        <div className="nav nav-tabs nav-fill blog-tabs" id="nav-tab" role="tablist">
                                            <a id="nav-all-tab"
                                                data-toggle="tab" href="#nav-all" role="tab"
                                                aria-controls="nav-all" aria-selected="true"
                                                onClick={() => updateItemsShow("All")}
                                                className={status ? "tab-active" : "nav-item nav-link"}
                                            >All</a>
                                            <a id="nav-javascript-tab"
                                                data-toggle="tab" href="#nav-javascript" role="tab"
                                                aria-controls="nav-javascript" aria-selected="false"
                                                onClick={() => updateItemsShow("JavaScript")}
                                                className={status ? "tab-active" : "nav-item nav-link"}
                                            >JavaScript</a>
                                            <a id="nav-python-tab"
                                                data-toggle="tab" href="#nav-python" role="tab"
                                                aria-controls="nav-python" aria-selected="false"
                                                onClick={() => updateItemsShow("Python")}
                                                className={status ? "tab-active" : "nav-item nav-link"}
                                            >Python</a>
                                            <a id="nav-softwareengineer-tab"
                                                data-toggle="tab" href="#nav-softwareengineer" role="tab"
                                                aria-controls="nav-softwareengineer" aria-selected="false"
                                                onClick={() => updateItemsShow("Software Engineer")}
                                                className={status ? "tab-active" : "nav-item nav-link"}
                                            >Software Engineer</a>
                                        </div>
                                    </nav>

                                </div>
                            </div>
                        </section>
                        {/* <!--───────────────card───────────────--> */}
                        <section className='articleList'>
                            {filteredArticles.map(article => {
                                return (<>
                                    <ArticleCard deleteArticle={deleteArticle} handleCheck={handleCheck} article={article}
                                        key={article.id}
                                    />
                                    <hr className='article-line' />
                                </>
                                )
                            })}
                            <Pagination currentPage={currentPage} paginate={paginate} nextPage={nextPage} prevPage={prevPage}
                            postsPerPage={postsPerPage} totalPosts={articles.length} />
                        </section>
                        <div>
                            <section className='article-sidebar'>
                                <div className="popular">
                                    <h2 className='article-card-header'>Popular Post</h2>
                                    <section className='popular-articles'>
                                        {articles.map(article => {
                                            return (<>
                                                <a href={`/blog/${article.id}`} target="_blank"rel="noopener noreferrer" >
                                                    <div className="popular-link">{article.title}</div><br /></a>
                                            </>)
                                        })}
                                    </section>
                                </div>
                                <br />
                                <Subscribe />
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="header-hr "/>
            <Footer/>
        </>
    )
}



export default Articles;