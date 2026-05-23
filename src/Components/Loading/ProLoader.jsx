import React from 'react';
import './ProLoader.css';

const ProLoader = () => {
  const logo = "https://d2nrcsymqn25pk.cloudfront.net/Assets/Images/newLogo.png";
  return (
    <div className="loading-screen">
      <div className="loading-animation">
        <img src={logo} alt="Linkedin logo" width='50rem' className="logo-loader"/>
        {/* <img src="https://i.ibb.co/nf2M1fs/linkedin.png" alt="Linkedin logo" class="logo-loader"/> */}
        <div className="loading-bar"></div>
    </div>
  </div>
  )
}

export default ProLoader;
