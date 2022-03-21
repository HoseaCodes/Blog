import React from 'react';
import './ProLoader.css';
import logo from '../../Assets/Images/newLogo.png';

const ProLoader = () => {
  return (
    <div class="loading-screen">
      <div class="loading-animation">
        <img src={logo} alt="Linkedin logo" width='50rem' class="logo-loader"/>
        {/* <img src="https://i.ibb.co/nf2M1fs/linkedin.png" alt="Linkedin logo" class="logo-loader"/> */}
        <div class="loading-bar"></div>
    </div>
  </div>
  )
}

export default ProLoader;
