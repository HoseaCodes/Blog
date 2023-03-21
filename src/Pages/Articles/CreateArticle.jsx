import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from '../../GlobalState';
import Loading from '../../Loading';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';
import './CreateArticle.css';
import marked from 'marked';
import { v4 as uuidv4 } from 'uuid';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';
import Error401 from '../Error/Error401'
import {StyledButton} from '../../Layout/Button/styledButton';
import { articleTempltes } from './ArticleTemplate';
import { arrayItems } from "./AIOptions";
import { Configuration, OpenAIApi } from "openai";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';



function CreatArticle() {
    const [markdown, setMarkdown] = useState(articleTempltes[3].markdown)
    const initialState = {
        article_id: '',
        title: '',
        subtitle: '',
        description: 'Description',
        markdown: markdown,
        category: '',
        id: ''
    }
    const state = useContext(GlobalState)
    const [article, setArticle] = useState(initialState)
    const [images, setImages] = useState(false)
    // const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const param = useParams()
    const [articles] = state.articlesAPI.articles
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.articlesAPI.callback
    const [isLoggedIn] = state.userAPI.isLoggedIn
    const [option, setOption] = useState({});
    const [result, setResult] = useState("");
    const [input, setInput] = useState("");
    const [show, setShow] = useState(false);

    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_VITE_Open_AI_Key,
    });

    const openai = new OpenAIApi(configuration);

    const selectOption = (option) => {
        setOption(option);
    };

    const doStuff = async () => {
        let object = { ...option, prompt: input };
        console.log(process.env.REACT_APP_VITE_Open_AI_Key)
        const response = await openai.createCompletion(object);
        console.log(response)
        setResult(response.data.choices[0].text);
    };


    function sleep(num) {
        let now = new Date();
        const stop = now.getTime() + num;
        while(true) {
            now = new Date();
            if(now.getTime() > stop) return;
        }
    }

    useEffect(() => {
        if (!isLoggedIn) {
            sleep(5000)
            history.push('/')
        }
    }, [])

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            articles.forEach(article => {
                if (article._id === param.id) {
                    setArticle(article)
                    // setImages(article.images)
                }
            })
        } else {
            setOnEdit(false)
            setArticle(initialState)
            // setImages(false)
        }
    }, [param.id, articles])

    const styleUpload = {
        display: images ? "block" : "none"
    }
    const handleUpload = async e => {
        e.preventDefault()
        try {
            const file = e.target.files[0]
            if (!file) return alert("File not exist")
            if (file.size > 1024 * 1024) return alert("Size too large")
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert("File format is incorrect")

            const formData = new FormData()
            formData.append('file', file)

            setLoading(true)

            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            setLoading(false)
            setImages(res.data.result)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestory = async () => {
        try {
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.public_id })
            setLoading(false)
            setImages('')
            history.push('/blog')
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e => {
        const { name, value } = e.target
        setArticle({ ...article, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!images) return alert("No Image Upload")
            if (onEdit) {
                await axios.put(`/api/articles/${article._id}`, { ...articles, images })
            } else {
                await axios.post('/api/articles', { ...article, images })
                setImages(false)
                setArticle(initialState)
            }
            setCallback(!callback)

            history.push('/blog')
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const updateMarkdown = (e) => {
        const { name } = e.target
        setMarkdown(articleTempltes[e.target.options.selectedIndex].markdown)
        console.log(article)
        setArticle({ ...article, [name]: articleTempltes[e.target.options.selectedIndex].markdown })
                console.log(article)
    }

    function OptionSelection({ arrayItems, selectOption }) {
        return (
            <>
            <h1 className="heading">ChatGPT Clone</h1>

            <div className="grid-main">
                {arrayItems.map((item) => {
                return (
                    <div
                    className="grid-child"
                    onClick={() => selectOption(item.option)}
                    >
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                    </div>
                );
                })}
            </div>
            </>
        );
    }


    const handleChangeInputOPENPAI = e => {
        console.log(input)
        const { value } = e.target
        setInput(e.target.value)
    }
    function Translation({ doStuff, handleChange, handleChangeInputOPENPAI, setInput, setMessage, result }) {
        return (
            <div>
                <textarea
                    name="input"
                    type="text"
                    className="text-area"
                    cols={55}
                    rows={10}
                    onChange={handleChangeInputOPENPAI}
                ></textarea>
                <button className="action-btn" onClick={doStuff}>
                    DO YOU STUFF!
                </button>

                <h3 className="result-text">{result.length > 0 ? result : ""}</h3>
            </div>
        );
    }

    function Example() {
        console.log(show)
        return (
            <>
                <Button variant="primary" onClick={() => setShow(true)}>
                    Blog Post Preview
                </Button>

                <Modal
                    show={show}
                    animation={false}
                    onHide={() => setShow(false)}
                    // dialogClassName="modal-100w"
                    aria-labelledby="example-custom-modal-styling-title"
                    style={{width: '200% !important', right: '40% !important'}}
                >
                    <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                        Blog Post Preview
                    </Modal.Title>
                    </Modal.Header>
                    <Modal.Body dangerouslySetInnerHTML={{ __html: marked(article.markdown) }}>
                        
                    </Modal.Body>
                </Modal>
            </>
        );
    }


    return (
        <>
        {isLoggedIn ?
            <>
                <NavBar/>
                    <div className="create_article" >
                        <div className="container fluid col-md-12">
                            <div id="signupbox" >
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <div className="panel-title text-center"><h3>Add Article</h3></div>
                                    </div>
                                    <div className="panel-body" >
                                        <form className="row g-3" onSubmit={handleSubmit}>
                                            <div className="col-md-6">
                                                <div id="div_p_name" className="form-group required">
                                                    {/* <label for="p_name" className="control-label col-md-4  requiredField">Title<span className="asteriskField">*</span> </label> */}
                                                    <div className="controls col-md-8 ">
                                                        <input 
                                                          className="input-md emailinput form-control mb"
                                                          placeholder="Enter Article Title Name" 
                                                          type="text"
                                                          name="title"
                                                          required value={article.title}
                                                          onChange={handleChangeInput}
                                                        // disabled={onEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div id="div_p_name" className="form-group required">
                                                    {/* <label for="p_name" className="control-label col-md-4  requiredField">Subtitle<span className="asteriskField">*</span> </label> */}
                                                    <div className="controls col-md-8 ">
                                                        <input 
                                                          className="input-md emailinput form-control mb" 
                                                          placeholder="Enter Article Subtitle Name" 
                                                          type="text"
                                                          name="subtitle"
                                                          required value={article.subtitle}
                                                          onChange={handleChangeInput}
                                                          // disabled={onEdit}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div id="div_p_id" className="form-group required">
                                                    {/* <label for="p_id" className="control-label col-md-4  requiredField">Article Id<span className="asteriskField">*</span> </label> */}
                                                    <div className="controls col-md-8 ">
                                                        <input className="input-md emailinput form-control mb"
                                                            name="article_id"
                                                            required value={uuidv4()}
                                                            onChange={handleChangeInput}
                                                            disabled />
                                                    </div>
                                                </div>
                                            </div>
                                            {/* <div className="col-md-6 mb-0">
                                                <div id="div_p_id" className="form-group required">
                                                    <label 
                                                        for="tags" 
                                                        className="control-label col-md-6"
                                                        requiredField
                                                        > Article Language Tag
                                                        <span className="asteriskField">*</span> 
                                                    </label>
                                                </div>
                                            </div> */}
                                            <div className="col-md-6">
                                                <div id="div_id_downloads" className="form-group required">
                                                    <div className="controls col-md-8 ">
                                                        <select 
                                                          name="tags" 
                                                          type="text" 
                                                          className="form-control mb" 
                                                          style={{height: 'auto'}}
                                                          >
                                                            <option value="volvo">Java</option>
                                                            <option value="saab">Python</option>
                                                            <option value="fiat">JavaScript</option>
                                                            <option value="audi">Software Engineer</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div id="div_description" className="form-group required">
                                                    {/* <label for="p_name" className="control-label col-md-4  requiredField">Description<span className="asteriskField">*</span> </label> */}
                                                    <div className="controls col-md-8 ">
                                                        <textarea className="mb"
                                                            name="description"
                                                            required value={article.description}
                                                            onChange={handleChangeInput}
                                                            style={{ width: '100%' }}
                                                            rows="5"
                                                            cols="50"
                                                        ></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div id="div_id_image" className="form-group required">
                                                    {/* <label for="id_image" className="control-label col-md-4  requiredField">Article Image<span className="asteriskField">*</span> </label> */}
                                                    <div className="controls col-md-8 mb upload" >

                                                        <input className="input-md emailinput form-control mb"
                                                            name="file" id="file_up"
                                                            onChange={handleUpload}
                                                            placeholder="Enter Project Id" type="file" />

                                                        {
                                                            loading ?
                                                                <div id="file_img"><Loading /></div>
                                                                :
                                                                <div id="file_img" style={styleUpload}>
                                                                    <img src={images ? images.url : ''} alt="" />
                                                                    <span onClick={handleDestory}>X</span>
                                                                </div>

                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                             <div className="col-md-6">
                                                <div id="div_id_downloads" className="form-group required">
                                                    <div className="controls col-md-8 ">
                                                        <label 
                                                        for="markdown" 
                                                        className="control-label col-md-8"
                                                        requiredField
                                                        >
                                                            Article Template
                                                            <span className="asteriskField">*</span> 
                                                            &nbsp;&nbsp;
                                                            <span className="qs">? <span className="popover above">These templates will give you a starting point to start writing a blog.</span></span>
                                                        </label>
                                                        <select 
                                                          onChange={updateMarkdown}
                                                          name="markdown" 
                                                          type="text" 
                                                          className="form-control mb" 
                                                          style={{height: 'auto'}}
                                                          >
                                                            {
                                                                articleTempltes.map(article => (
                                                                        <option key={article.id} value={article.name}>{article.name}</option>
                                                                    )
                                                                )
                                                            }
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <ReactMarkdown source={input} className="markdown" /> */}
                                            <div className="col-md-12">
                                                <div id="div_description" className="form-group required row">
                                                    {/* <label for="p_name" className="text-center control-label col-md-12 requiredField">Markdown<span className="asteriskField">*</span> </label> */}
                                                    <div className="controls col-md-6 ">
                                                        <h5 className="text-center">Enter your markdown</h5>
                                                        <textarea className="preview d-flex jusify-self-center mauto mb"
                                                            name="markdown"
                                                            required value={article.markdown}
                                                            onChange={handleChangeInput}
                                                            // value={input}
                                                        ></textarea>
                                                    </div>
                                                    <div className="col-6" id="perview">
                                                        <h5 className="text-center">See the result</h5>
                                                        <div className="preview" dangerouslySetInnerHTML={{ __html: marked(article.markdown) }}>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <br />
                                            <div className="form-group">
                                                <div className="mauto maxwidth col-md-12 text-center d-flex justify-content-center">
                                                    <br /> <br />
                                                    <StyledButton type="submit"> Add Article</StyledButton>
                                                    &nbsp;&nbsp;
                                                    <StyledButton type="reset"><a href="/blog">Cancel</a></StyledButton>
                                                    {/* <button className="personal-btn" type="submit">Add Article</button> */}
                                                    {/* <button className="personal-btn" type="reset"><a href="/blog">Cancel</a> </button> */}
                                                </div>
                                            </div>
                                        </form>
                                        <div>
                                            <Example />
                                        </div>
                                        <div>
                                            Need Help <span className="qs">? <span className="popover above">Our AI blog bot will help you create stunning blog in a flash.</span></span>
                                            <div className="App">
                                                {Object.values(option).length === 0 ? (
                                                <OptionSelection arrayItems={arrayItems} selectOption={selectOption} />
                                                ) : (
                                                    <>
                                                        <div>
                                                            <textarea
                                                                name="input"
                                                                type="text"
                                                                className="text-area"
                                                                cols={55}
                                                                rows={10}
                                                                onChange={handleChangeInputOPENPAI}
                                                            ></textarea>
                                                            <button className="action-btn" onClick={doStuff}>
                                                                DO YOU STUFF!
                                                            </button>

                                                            <h3 className="result-text">{result.length > 0 ? result : ""}</h3>
                                                        </div>
                                                    </>
                                                    // <Translation handleChange={handleChange} handleChangeInputOPENPAI={handleChangeInputOPENPAI} doStuff={doStuff} setInput={setInput} setMessage={setMessage} result={result} />
                                                    )}
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr style={{ background: 'rgb(235,183,65)', width: '100%' }} />
                <Footer/>
            </>
        :
            <Error401 />
        }
         
        </>
    )
}

export default CreatArticle;
