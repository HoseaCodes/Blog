import React, { useState } from 'react';
import "./NavBar2.css";
import { Link } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { useDarkMode } from "../../Components/DarkMode/useDarkMode";
import { GlobalStyles } from "../../Components/GlobalStyles/GlobalStyles";
import { lightTheme, darkTheme } from "../../Components/Themes/Themes";
import Toggle from "../../Components/Toggle/Toggle"



const NavBar2 = () => {
    const [theme, themeToggler, mountedComponent] = useDarkMode();

    const themeMode = theme === 'light' ? lightTheme : darkTheme;

    return (
        <ThemeProvider theme={themeMode}>
            <GlobalStyles />
            <div className="header-nav">
                <div className="left-nav">
                    <Link to="/" className="item active">Home</Link>
                    <Link to="/projects" className="item">Projects</Link>
                    <Link to="/articles" className="item">Articles</Link>
                    <Link to="/about" className="item">About</Link>
                    <Link to="/contact" className="item">Contact</Link>
                    <Toggle theme={theme} toggleTheme={themeToggler} />

                </div>

            </div>
        </ThemeProvider>

    )
};

export default NavBar2;
