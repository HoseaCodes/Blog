import React, { useContext, useState, useEffect } from 'react';

import { useParams, Link } from 'react-router-dom';

import RelatedProducts from './RelatedProducts';
import { GlobalState } from '../../GlobalState';
import './DetailProduct.css';
import NavBar from '../../Components/NavBar/NavBar';
import Footer from '../../Components/Footer/Footer';

const DetailProduct = () => {
    const params = useParams()
    const state = useContext(GlobalState)
    const [products] = state.productsAPI.products
    const addCart = state.userAPI.addCart
    const [detailProduct, setdetailProduct] = useState([])

    useEffect(() => {
        if (params.id) {
            products.forEach(product => {
                if (product._id === params.id) setdetailProduct(product)
            })
        }
    }, [params.id, products])

    if (detailProduct.length === 0) return null;
    const { images, title, price, description, content, sold, category, product_id } = detailProduct;
    return (
        <>
          <NavBar/>

          <div className="container">
            <div className="row my-5">
              <div className="col-md-6 text-center">
                <img src={images.url} width={'2000rem'}  alt='product' />
              </div>
              <div className="col-md-6">
                <h2>{title || "No Title"}</h2>
                <h6>#id: {product_id}</h6>
                <p className="text-wrap">
                  {description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                </p>
                <p>{content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}</p>
                <h2>Categories</h2>
                {/* {category.map(item => <span class="badge rounded-pill bg-info text-dark mb-3 me-2">{item}</span>)} */}
              <span class="badge rounded-pill bg-info text-dark mb-3 me-2">{category || "software"}</span>
                <h2>Price</h2>
                <h4>${price || "25"} </h4>
                <p>Sold: {sold}</p>
                <Link to="/cart" className="cart"
                  onClick={() => addCart(detailProduct)}>
                    Buy Now
                </Link>
              </div>
            </div>
          </div>
          <div>
            <h2>Related Products</h2>
            <div>
            {
              products.map(product => {
              return product.category === category
              ? <RelatedProducts key={product._id} product={product} /> : null
            })
            }
            </div>
          </div>
          <Footer/>
        </>
    )
}

export default DetailProduct;
