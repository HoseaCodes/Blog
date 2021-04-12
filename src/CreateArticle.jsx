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
    const [articles] = state.articleAPI.articles
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.articleAPI.callback

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            articles.forEach(article => {
                if (article._id === param.id) {
                    setArticle(article)
                    setImages(article.images)
                }
            })
        } else {
            setOnEdit(false)
            setArticle(initialState)
            setImages(false)
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

            let formData = new FormData()
            formData.append('file', file)

            setLoading(true)

            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data' }
            })
            setLoading(false)
            setImages(res.data)

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestory = async e => {
        try {
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.public_id })
            setLoading(false)
            setImages(false)
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

            history.push('/')
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    return (
        <div className="create_product">
            <div className="upload">
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

            </div>
            <form
                onSubmit={handleSubmit}
            >
                <div className="row">

                    <label htmlFor="product_id">Product ID</label>
                    <input type="text" name="product_id" id="product_id"
                        required value={article.article_id}
                        onChange={handleChangeInput}
                        disabled={onEdit}
                    />
                </div>
                <div className="row">
                    <label htmlFor="product_id">Title</label>
                    <input type="text" name="title" id="title"
                        required value={article.title}
                        onChange={handleChangeInput}

                    />
                </div>
                <div className="row">
                    <label htmlFor="price">Subtitle</label>
                    <input type="number" name="price" id="price"
                        required value={article.subtitle}
                        onChange={handleChangeInput}

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
        </div>
    )
}

export default CreatArticle;