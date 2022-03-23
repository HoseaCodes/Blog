import React from 'react';
import Footer from '../../Components/Footer/Footer';
import NavBar from '../../Components/NavBar/NavBar';
import Products from '../../Components/Product/Products';
// import Masonry from '../../Components/Masonry/Masonry';
import Sidebar from './Header';
import './Shop.css';

const Shop = () => {
    return (
          <div>
            {/* <iframe title='hoseacodes-store' src='https://teespring.com/stores/hoseacodes-2'>
            </iframe> */}
            <NavBar/>
            <div className="wrapper">
              {/* <NavBar/> */}
              <div className="shop-container">
                  <Sidebar className="sidebar" />
                  <Products/>
                  {/* <Masonry/> */}
              </div>
            </div>
            <Footer/>
          </div>
    )
}

export default Shop;
