// ThemeSwitcher.js with AOS initialization
import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css'; // Import AOS styles

const ThemeSwitcher = () => {
  // Check if user has a stored preference or use system preference
  const getInitialTheme = () => {
    // Check if we're in the browser environment
    if (typeof window === 'undefined') return 'light';
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800, // Animation duration in ms
      easing: 'ease-in-out', // Animation easing
      once: false, // Whether animation should happen only once
      mirror: true, // Whether elements should animate out when scrolling past them
      offset: 100, // Offset (in px) from the original trigger point
    });
  }, []);

  // Apply theme to document when it changes
  useEffect(() => {
    // Make sure we're in the browser environment
    if (typeof window === 'undefined') return;
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Save preference to localStorage
    localStorage.setItem('theme', theme);
    
    // Refresh AOS when theme changes
    setTimeout(() => {
      AOS.refresh();
    }, 300);
  }, [theme]);

  // Toggle theme when button is clicked
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button 
      className="theme-toggle" 
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <span className="icon moon">🌙</span>
      <span className="icon sun">☀️</span>
    </button>
  );
};

export default ThemeSwitcher;