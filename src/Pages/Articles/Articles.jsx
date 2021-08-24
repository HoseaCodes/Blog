
import React, { useState, useContext } from 'react';
import './Articles.css'
import NavBar2 from '../../Components/NavBar/NavBar';
import Subscribe from '../../Components/Subscribe/Subscribe'
// import { articleData, categoryTags } from './ArticleData';
import ArticleCard from './ArticleCard';
// import { auth, login, logout } from '../../services/firebase';
import { GlobalState } from '../../GlobalState';
import Loading from '../../Loading';
import axios from 'axios';
import Footer from '../../Components/Footer/Footer';

const Articles = () => {

    const state = useContext(GlobalState)
    const [articles, setArticles] = state.articlesAPI.articles
    // const [token] = state.token
    const [callback, setCallback] = state.articlesAPI.callback
    const [loading, setLoading] = useState(false)
    // const [isCheck, setIsCheck] = useState(false)
    const [tagsShow, setTagsShow] = useState('All')
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('active')

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

    // const checkAll = () => {
    //     articles.forEach(article => {
    //         article.checked = !isCheck
    //     })
    //     setArticles([...articles])
    //     setIsCheck(!isCheck)
    // }

    // const deleteAll = () => {
    //     articles.forEach(article => {
    //         if (article.checked) deleteArticle(article._id, article.images.public_id)
    //     })
    // }

    const filteredArticles = articles.filter(
        (article) => {
            return article.title.toLowerCase().indexOf(
                search.toLowerCase()) !== -1;
        }
    );

    const updateSearch = event => {
        setSearch({ search: event.target.value.substr(0, 20) })
    }


    const updateItemsShow = (str) => {
        setTagsShow(str)
        setStatus("active")

    }

    let items = []
    if (tagsShow === "All") {
        items = filteredArticles
    }
    else if (tagsShow === "JavaScript") {
        items = filteredArticles.filter(item => item.type.includes("JavaScript"))
    }
    else if (tagsShow === "Python") {
        items = filteredArticles.filter(item => item.type.includes("Python"))
    }
    else if (tagsShow === "Software Engineer") {
        items = filteredArticles.filter(item => item.type.includes("Software Engineer"))
    }
    console.log(filteredArticles + "filtered")


    if (loading) return <div className="products"><Loading /></div>
    return (
        <>

            {/* <div className="delete-all">
                <span>Select All</span>
                <input type="checkbox" checked={isCheck} onChange={checkAll} />
                <button onClick={deleteAll}>Delete All</button>
            </div>
            <div className="products">
                {
                    articles.map(article => {
                        return <ArticleItem key={article._id} article={article}
                            deleteArticle={deleteArticle} handleCheck={handleCheck} />
                    })
                }

            </div> */}



            <div className='article-container'>
                <NavBar2 />
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
                        onChange={(e) => updateSearch(e)}
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
                            {items.map(article => {
                                return (<>
                                    <ArticleCard deleteArticle={deleteArticle} handleCheck={handleCheck} article={article}
                                        key={article.id}
                                    />
                                    <hr className='article-line' />
                                </>
                                )
                            })}
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