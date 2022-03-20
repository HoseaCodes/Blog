import React from 'react';
import Footer from '../../Components/Footer/Footer';
import NavBar from '../../Components/NavBar/NavBar';
// import NavBar from '../../Components/NavBar/NavBar';
import Products from '../../Components/Product/Products';
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
              </div>
            </div>
            <Footer/>
          </div>
    )
}

export default Shop;
