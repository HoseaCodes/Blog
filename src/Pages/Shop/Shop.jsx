import React from 'react';
import Products from '../../Components/Product/Products';
import Sidebar from './Header';
import './Shop.css';

const Shop = () => {
    return (
        <div className="shop-page">
            <div className="shop-container">
                <aside className="shop-sidebar">
                    <Sidebar />
                </aside>
                <main className="shop-main">
                    <Products/>
                </main>
            </div>
        </div>
    )
}

export default Shop;
