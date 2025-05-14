// This file is the entry point for webpack
// It initializes the module federation before rendering the app

// Use dynamic import to load the bootstrap file
// This ensures that the federation modules are loaded first
import('./bootstrap.js');