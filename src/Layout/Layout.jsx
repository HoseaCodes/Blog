import React, { useState } from "react";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import TerminalModal from "../Components/ShortcutModals/TerminalModal";
import UbuntuEasterEggMount from "../Components/UbuntuEasterEgg";
import MacEasterEggMount from "../Components/MacEasterEgg";

const Layout = ({ children }) => {
  const [defaultFooter, setDefault] = useState(true);
  return (
    <>
      <NavBar />
      <main>{children}</main>
      <Footer defaultFooter={defaultFooter} setDefault={setDefault} />
      <TerminalModal />
      <UbuntuEasterEggMount />
      <MacEasterEggMount />
    </>
  );
};

export default Layout;
