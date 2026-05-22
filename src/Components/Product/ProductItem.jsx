import React from 'react';

import BtnRender from './BtnRender';
import './ProductItem.css';

const ProductItem = ({ product, deleteProduct, isAdmin, handleCheck }) => {
    const imageUrl = product?.images?.url;
    const priceLabel =
        typeof product?.price === 'number'
            ? `$${product.price.toFixed(2)}`
            : product?.price
                ? `$${product.price}`
                : '';

    return (
        <article className="product_card">
            <div className="product_media">
                {isAdmin && (
                    <label className="product_select">
                        <input
                            type="checkbox"
                            checked={!!product.checked}
                            onChange={() => handleCheck(product._id)}
                            aria-label={`Select ${product.title}`}
                        />
                    </label>
                )}
                {imageUrl ? (
                    <img src={imageUrl} alt={product.title} loading="lazy" />
                ) : (
                    <div className="product_media_placeholder" aria-hidden />
                )}
            </div>

            <div className="product_body">
                <h2 className="product_title" title={product.title}>
                    {product.title}
                </h2>
                {priceLabel && <span className="product_price">{priceLabel}</span>}
                {product.description && (
                    <p className="product_desc">{product.description}</p>
                )}
                <BtnRender product={product} deleteProduct={deleteProduct} />
            </div>
        </article>
    );
};

export default ProductItem;
