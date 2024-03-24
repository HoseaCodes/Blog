import React, { useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

import axios from 'axios';
import { useHistory, useParams } from 'react-router-dom';

import Loading from '../Loading/Loading';
import { GlobalState } from '../../GlobalState';
import './CreateProduct.css';

const initialState = {
    product_id: uuidv4().split('-').join(""),
    title: '',
    price: 0,
    description: 'Description',
    content: 'Content',
    category: '',
    id: ''
}

function CreateProduct() {
    const state = useContext(GlobalState)
    const [product, setProduct] = useState(initialState)
    const [token] = state.token
    const [images, setImages] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isAdmin] = state.userAPI.isAdmin
    const history = useHistory()
    const param = useParams()
    const [products] = state.productsAPI.products
    const [onEdit, setOnEdit] = useState(false)
    const [callback, setCallback] = state.productsAPI.callback

    useEffect(() => {
        if (param.id) {
            setOnEdit(true)
            products.forEach(product => {
                if (product._id === param.id) {
                    setProduct(product)
                    setImages(product.images)
                }
            })
        } else {
            setOnEdit(false)
            setProduct(initialState)
            setImages(false)
        }
    }, [param.id, products])

    const styleUpload = {
        display: images ? "block" : "none"
    }
    const handleUpload = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("You're not an admin")
            const file = e.target.files[0]
            if (!file) return alert("File not exist")
            if (file.size > 1024 * 1024) return alert("Size too large")
            if (file.type !== 'image/jpeg' && file.type !== 'image/png') return alert("File format is incorrect")

            const formData = new FormData()
            formData.append('file', file)
            setLoading(true)

            const res = await axios.post('/api/upload', formData, {
                headers: { 'content-type': 'multipart/form-data', Authorization: token }
            })

            setLoading(false)
            setImages({
              url: res.data.result.secure_url,
              id: res.data.result.public_id
            })

        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleDestory = async e => {
      e.preventDefault;
        try {
            if (!isAdmin) return alert("You're not an admin")
            setLoading(true)
            await axios.post('/api/destroy', { public_id: images.id }, {
                headers: { Authorization: token }

            })
            setLoading(false)
            setImages(false)
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const handleChangeInput = e => {
        const { name, value } = e.target
        console.log(name, value)
        setProduct({ ...product, [name]: value })
    }

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            if (!isAdmin) return alert("You're not an admin")
            if (!images) return alert("No Image Upload")
            if (onEdit) {
              console.log(product)
                await axios.put(`/api/products/${product._id}`, { ...product, images }, {
                    headers: { Authorization: token }

                })
            } else {
                await axios.post('/api/products', { ...product, images }, {
                    headers: { Authorization: token }

                })
                setImages(false)
                setProduct(initialState)
            }
            setCallback(!callback)

            history.push('/products')
        } catch (err) {
            alert(err.response.data.msg)
        }
    }

    const software = {name:"Software"}
    const books = {name:"Books"}
    const categories = [software, books];
    console.log(product)

    return (
      <>
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
                    <label htmlFor="product_id">Title</label>
                    <input type="text" name="title" id="title"
                        required value={product.title}
                        onChange={handleChangeInput}

                    />
                </div>
                <div className="row">
                    <label htmlFor="price">Price</label>
                    <input type="number" name="price" id="price"
                        required value={product.price}
                        onChange={handleChangeInput}

                    />
                </div>
                <div className="row">
                    <label htmlFor="description">Description</label>
                    <textarea type="text" name="description" id="description"
                        required value={product.description}
                        onChange={handleChangeInput}
                        rows="5"
                    />
                </div>
                <div className="row">
                    <label htmlFor="content">Content</label>
                    <textarea type="text" name="content" id="content"
                        required value={product.content}
                        onChange={handleChangeInput}
                        rows="5"
                    />
                </div>
                <div className="row">
                    <label htmlFor="categoies">Categoies: </label>
                    <select name="category" value={product.category}
                        onChange={handleChangeInput}
                    >
                        <option value="">Please select a category</option>
                        {
                            categories.map(category => (
                                <option value={category._id} key={category._id}>
                                    {category.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <button type="submit">{onEdit ? "Update" : "Create"}</button>
            </form>
        </div>
      </>
    )
}

export default CreateProduct;
