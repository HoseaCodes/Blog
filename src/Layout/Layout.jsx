import React, { useState } from "react";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import TerminalModal from "../Components/Terminal/TerminalModal";

const Layout = ({ children }) => {
  const [defaultFooter, setDefault] = useState(true);
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer defaultFooter={defaultFooter} setDefault={setDefault} />
      <TerminalModal />
    </>
  );
};

export default Layout;
