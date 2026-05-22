import React, { useContext, useState } from 'react';

import axios from 'axios'
import { Link } from 'react-router-dom';
import { AiOutlineShop, AiOutlinePlus } from 'react-icons/ai';
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
    const [apiLoading] = state.productsAPI.loading
    const [apiError] = state.productsAPI.error
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

    const breakpointColumnsObj = {
        default: 3,
        1400: 3,
        1100: 2,
        700: 1
    };

    if (loading) return <div><Loading /></div>

    const hasProducts = products.length > 0;

    return (
        <section className="shop-products">
            <header className="shop-header-bar">
                <div>
                    <h1 className="shop-title">Shop</h1>
                    <p className="shop-subtitle">
                        {apiLoading
                            ? 'Loading products…'
                            : hasProducts
                                ? `${products.length} ${products.length === 1 ? 'product' : 'products'} available`
                                : 'Browse the catalog'}
                    </p>
                </div>
                {isAdmin && (
                    <Link to="/admin/shop/create_product" className="shop-cta">
                        <AiOutlinePlus aria-hidden /> New Product
                    </Link>
                )}
            </header>

            {isAdmin && hasProducts && (
                <div className="shop-admin-bar">
                    <label className="shop-select-all">
                        <input type="checkbox" checked={isCheck} onChange={checkAll} />
                        <span>Select all</span>
                    </label>
                    <button type="button" className="shop-delete-all" onClick={deleteAll}>
                        Delete selected
                    </button>
                </div>
            )}

            {hasProducts && (
                <div className="products">
                    <Masonry
                        breakpointCols={breakpointColumnsObj}
                        className="my-masonry-grid"
                        columnClassName="my-masonry-grid_column"
                    >
                        {products.map(product => (
                            <ProductItem
                                key={product._id}
                                product={product}
                                isAdmin={isAdmin}
                                deleteProduct={deleteProduct}
                                handleCheck={handleCheck}
                            />
                        ))}
                    </Masonry>
                </div>
            )}

            {hasProducts && <LoadMore />}

            {apiLoading && !hasProducts && (
                <div className="shop-state"><Loading /></div>
            )}

            {!apiLoading && apiError && (
                <div className="shop-state shop-state-error">
                    <h3>Couldn't load products</h3>
                    <p>{apiError}</p>
                </div>
            )}

            {!apiLoading && !apiError && !hasProducts && (
                <div className="shop-state shop-empty">
                    <AiOutlineShop className="shop-empty-icon" aria-hidden />
                    <h3>No products yet</h3>
                    <p>
                        {isAdmin
                            ? "Get started by adding your first product to the catalog."
                            : "Check back soon — new items are on the way."}
                    </p>
                    {isAdmin && (
                        <Link to="/admin/shop/create_product" className="shop-cta">
                            <AiOutlinePlus aria-hidden /> Create your first product
                        </Link>
                    )}
                </div>
            )}
        </section>
    )
}

export default Products;
