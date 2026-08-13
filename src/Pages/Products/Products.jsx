import React from 'react';
import ProductsComponent from '../../Components/Product/Products';
import Sidebar from '../Shop/Header';
import '../Shop/Shop.css';

const Products = () => {
  return (
    <div className="shop-page">
      <div className="shop-container">
        <aside className="shop-sidebar">
          <Sidebar />
        </aside>
        <main className="shop-main">
          <ProductsComponent />
        </main>
      </div>
    </div>
  );
};

export default Products;
