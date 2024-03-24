import React from 'react';
import Products from '../../Components/Product/Products';
// import Masonry from '../../Components/Masonry/Masonry';
import Sidebar from './Header';
import './Shop.css';

const Shop = () => {
    return (
          <div>
            {/* <iframe title='hoseacodes-store' src='https://teespring.com/stores/hoseacodes-2'>
            </iframe> */}
            <div className="wrapper">
              {/* <NavBar/> */}
              <div className="shop-container">
                  <Sidebar className="sidebar" />
                  <Products/>
                  {/* <Masonry/> */}
              </div>
            </div>
          </div>
    )
}

export default Shop;
