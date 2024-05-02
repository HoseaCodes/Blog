import React, { useContext, useState } from 'react';

import axios from 'axios'
import LoadMore from './LoadMore'
import Masonry from 'react-masonry-css'
import Loading from '../Loading/ProLoader';
import ProductItem from './ProductItem';
import { GlobalState } from '../../GlobalState';
import './Products.css';

const Products = () => {
    const state = useContext(GlobalState)
    const [products, setProducts] = state.productsAPI.products
    const [isAdmin] = state.userAPI.isAdmin
    const [token] = state.token
    const [callback, setCallback] = state.productsAPI.callback
    const [loading, setLoading] = useState(false)
    const [isCheck, setIsCheck] = useState(false)

    const deleteProduct = async (id, public_id) => {
        try {
            setLoading(true)
            const destroyImg = axios.post('/api/destory', { public_id }, {
                headers: { Authorization: token }
            })
            const deleteProduct = axios.delete(`/api/products/${id}`, {
                headers: { Authorization: token }
            })
            await destroyImg
            await deleteProduct
            setLoading(false)
            setCallback(!callback)
        } catch (err) {
            alert(err.response.data.msg, err)
        }
    }

    const handleCheck = async (id) => {
        products.forEach(product => {
            if (product._id === id) product.checked = !product.checked
        })
        setProducts([...products])
    }

    const checkAll = () => {
        products.forEach(product => {
            product.checked = !isCheck
        })
        setProducts([...products])
        setIsCheck(!isCheck)
    }

    const deleteAll = () => {
        products.forEach(product => {
            if (product.checked) deleteProduct(product._id, product.images.id)
        })
    }
    /* for responsive masonry layout */
    const breakpointColumnsObj = {
        default: 3,
        1400: 2,
        900: 1
      };

    if (loading) return <div><ProLoader /></div>
    console.log(products)
    return (
        <>
          {/* <NavBar/> */}
            {
                isAdmin &&
                <div className="delete-all">
                    <span>Select All</span>
                    <input type="checkbox" checked={isCheck} onChange={checkAll} />
                    <button onClick={deleteAll}>Delete All</button>
                </div>
            }
            <div className="products">
                <Masonry breakpointCols={breakpointColumnsObj} className="my-masonry-grid" columnClassName="my-masonry-grid_column" >
                    {
                        products.map(product => {
                            return <ProductItem key={product._id} product={product}
                                isAdmin={isAdmin} deleteProduct={deleteProduct} handleCheck={handleCheck} />
                        })
                    }
                </Masonry>
            </div>
            <LoadMore />
            {products.length === 0 && <Loading />}
            {/* <Footer/> */}
        </>
    )
}

export default Products;
