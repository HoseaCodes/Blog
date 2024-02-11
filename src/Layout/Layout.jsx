import React, { useState } from "react";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";

const Layout = ({ children }) => {
  const [isHome, setIsHome] = useState(true);
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer isHome={isHome} setIsHome={setIsHome} />
    </>
  );
};

export default Layout;
