import React, { useContext, useState, useEffect } from 'react';
import { GlobalState } from './GlobalState';
import Loading from './Loading';
import { useHistory, useParams } from 'react-router-dom';
import axios from 'axios';

const initialState = {
    article_id: '',
    title: '',
    subtitle: '',
    description: 'Description',
    content: 'Content',
    category: '',
    id: ''
}

function CreatArticle() {
    const state = useContext(GlobalState)
    const [article, setArticle] = useState(initialState)
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const history = useHistory()
    const param = useParams()
    const [articles] = state.articlesAPI.articles
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.articlesAPI.callback

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
    // const handleUpload = async e => {
    //     e.preventDefault()
    //     try {
    //         const file = e.target.files[0]
    //         if (!file) return alert("File not exist")
    //         if (file.size > 1024 * 1024) return alert("Size too large")
    //         if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert("File format is incorrect")

    //         let formData = new FormData()
    //         formData.append('file', file)

    //         setLoading(true)

    //         const res = await axios.post('/api/upload', formData, {
    //             headers: { 'content-type': 'multipart/form-data' }
    //         })
    //         setLoading(false)
    //         setImages(res.data)

    //     } catch (err) {
    //         alert(err.response.data.msg)
    //     }
    // }

    // const handleDestory = async e => {
    //     try {
    //         setLoading(true)
    //         await axios.post('/api/destroy', { public_id: images.public_id })
    //         setLoading(false)
    //         setImages(false)
    //     } catch (err) {
    //         alert(err.response.data.msg)
    //     }
    // }

    const handleChangeInput = e => {
        const { name, value } = e.target
        setArticle({ ...article, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            // if (!images) return alert("No Image Upload")
            if (onEdit) {
                await axios.put(`/api/articles/${article._id}`, { ...articles, images })
            } else {
                await axios.post('/api/articles', { ...article, images })
                setImages(false)
                setArticle(initialState)
            }
            setCallback(!callback)

            history.push('/')
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className="create_product">
            {/* <div className="upload">
                <input type="file" name="file" id="file_up"
                    onChange={handleUpload} />
                {
                    loading ?
                        <div id="file_img"><Loading /></div>
                        :
                        <div id="file_img" style={styleUpload}>
                            <img src={images ? images.url : ''} alt="" />
                            <span onClick={handleDestory}>X</span>
                        </div>

                }

            </div> */}
            <form
                onSubmit={handleSubmit}
            >
                <div className="row">

                    <label htmlFor="product_id">Product ID</label>
                    <input type="text" name="article_id" id="product_id"
                        required value={article.article_id}
                        onChange={handleChangeInput}
                    // disabled={onEdit}
                    />
                </div>
                <div className="row">
                    <label htmlFor="title">Title</label>
                    <input type="text" name="title" id="title"
                        required value={article.title}
                        onChange={handleChangeInput}

                    />
                </div>
                <div className="row">
                    <label htmlFor="price">Subtitle</label>
                    <input type="text" name="subtitle" id="price"
                        required value={article.subtitle}
                        onChange={handleChangeInput}

                    />
                </div>
                <div className="row">
                    <label htmlFor="description">Marked</label>
                    <textarea type="text" name="markdown" id="description"
                        required value={article.markdown}
                        onChange={handleChangeInput}
                        rows="5"
                    />
                </div>
                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description"
                        required value={article.description}
                        onChange={handleChangeInput}
                        rows="5"
                    />
                </div>
                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content"
                        required value={article.content}
                        onChange={handleChangeInput}
                        rows="5"
                    />
                </div>
                <button type="submit">{onEdit ? "Update" : "Create"}</button>
            </form>

            <div class="container col-md-12">

                <div id="signupbox" style={{ marginTop: "50px" }}>
                    <div class="panel panel-default">
                        <div class="panel-heading">
                            <div class="panel-title text-center"><h3>Add Project Form</h3></div>
                        </div>
                        <div class="panel-body" >
                            <form method="post" action=".">


                                <form class="form-horizontal" method="post" >



                                    <div class="col-md-6">
                                        <div id="div_p_name" class="form-group required">
                                            <label for="p_name" class="control-label col-md-4  requiredField">Project Name<span class="asteriskField">*</span> </label>
                                            <div class="controls col-md-8 ">
                                                <input class="input-md emailinput form-control" placeholder="Enter Article Name" style={{ marginBottom: "10px" }} type="text"
                                                    name="article_id" id="product_id"
                                                    required value={article.article_id}
                                                    onChange={handleChangeInput}
                                                // disabled={onEdit}
                                                />
                                            </div>
                                        </div>
                                    </div>




                                    <div class="col-md-6">
                                        <div id="div_p_id" class="form-group required">
                                            <label for="p_id" class="control-label col-md-4  requiredField">Project Id<span class="asteriskField">*</span> </label>
                                            <div class="controls col-md-8 ">
                                                <input class="input-md emailinput form-control" id="p_id" name="p_id" placeholder="Enter Project Id" style={{ marginBottom: "10px" }} type="text" />
                                            </div>
                                        </div>
                                    </div>




                                    <div class="col-md-6">
                                        <div id="div_id_category" class="form-group required">
                                            <label for="id_category" class="control-label col-md-4  requiredField">Category<span class="asteriskField">*</span> </label>
                                            <div class="controls col-md-8 " style={{ marginBottom: "10px" }}>
                                                <label class="radio-inline"> <input type="radio" name="gender" id="id_categry_1" value="F" onchange="hide_price()" style={{ marginBottom: "10px" }} />Free Projects</label>
                                                <label class="radio-inline"> <input type="radio" name="gender" id="id_category_2" value="P" onchange="show_price()" style={{ marginBottom: "10px" }} />Premium Projects </label>
                                                <input type="hidden" name="price" id="price" placeholder="Enter Cost of Project " />
                                            </div>
                                        </div>
                                    </div>



                                    <div class="col-md-6">
                                        <div id="div_id_status" class="form-group required">
                                            <label for="id_status" class="control-label col-md-4  requiredField">Status<span class="asteriskField">*</span> </label>
                                            <div class="controls col-md-8 " style={{ marginBottom: "10px" }} />
                                            <label class="radio-inline"> <input type="radio" name="status" id="id_status_1" value="A" style={{ marginBottom: "10px" }} />Active</label>
                                            <label class="radio-inline"> <input type="radio" name="status" id="id_status_2" value="I" style={{ marginBottom: "10px" }} />Inactive</label>
                                        </div>
                                    </div>
                                </form>

                                <div class="col-md-6">
                                    <div id="div_id_downloads" class="form-group required">
                                        <label for="p_downloads" class="control-label col-md-4  requiredField">No.Of Downloads<span class="asteriskField">*</span> </label>
                                        <div class="controls col-md-8 ">
                                            <input class="input-md emailinput form-control" id="p_id" name="p_id" style={{ marginBottom: "10px" }} type="number" />
                                        </div>
                                    </div>
                                </div>


                                <div class="col-md-6">
                                    <div id="div_id_link" class="form-group required">
                                        <label for="p_link" class="control-label col-md-4  requiredField">Download Link<span class="asteriskField">*</span> </label>
                                        <div class="controls col-md-8 ">
                                            <input class="input-md emailinput form-control" id="p_id" name="p_id" style={{ marginBottom: "10px" }} type="url" />
                                        </div>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div id="div_id_downloads" class="form-group required">
                                        <label for="p_downloads" class="control-label col-md-4  requiredField">Project Language<span class="asteriskField">*</span> </label>
                                        <div class="controls col-md-8 ">
                                            <select name="cars" style={{ marginBottom: "10px" }} type="number" class="form-control" >

                                                <option value="volvo">Java</option>
                                                <option value="saab">Python</option>
                                                <option value="fiat">Php</option>
                                                <option value="audi">Dot Net</option>

                                            </select>
                                        </div>
                                    </div>
                                </div>



                                <div class="col-md-6">
                                    <div id="div_id_downloads" class="form-group required">
                                        <label for="p_downloads" class="control-label col-md-4  requiredField">Project Version<span class="asteriskField">*</span> </label>
                                        <div class="controls col-md-8 ">
                                            <input class="input-md emailinput form-control" id="p_id" name="p_id" style={{ marginBottom: "10px" }} type="text" />
                                        </div>
                                    </div>
                                </div>


                                <div class="col-md-6">
                                    <div id="div_id_image" class="form-group required">
                                        <label for="id_image" class="control-label col-md-4  requiredField">Main Image<span class="asteriskField">*</span> </label>
                                        <div class="controls col-md-8 " style={{ marginBottom: "10px" }}>

                                            <input class="input-md emailinput form-control" id="p_id" name="p_id" placeholder="Enter Project Id" style={{ marginBottom: "10px" }} type="file" />
                                        </div>
                                    </div>
                                </div>




                                <div class="col-md-12">
                                    <div id="div_description" class="form-group required">
                                        <label for="p_name" class="control-label col-md-2  requiredField">Description<span class="asteriskField">*</span> </label>
                                        <div class="controls col-md-10 ">
                                            <textarea style={{ marginBottom: "10px" }} ></textarea>
                                        </div>
                                    </div>
                                </div>
                                <br />
                                <div class="form-group">
                                    <div class="col-md-12 text-center">
                                        <br />
                                        <button class="btn btn-info btn-md" type="submit">Add Project</button>  <button class="btn btn-danger btn-md" type="reset">Cancel</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreatArticle;