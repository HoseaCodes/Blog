import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import authService from "../services/authService";

const initialState = {
  role: 0,
  name: "",
  email: "",
  password: "",
  avatar: "",
  title: "",
  location: "",
  work: [],
  education: [],
  skills: [],
  phone: "",
  socialMedia: [],
  websites: [],
  status: "APPROVED" // Default status
};

function UserAPI(token) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(initialState);
  const [authenticated, isAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookies] = useCookies(["cookie-name"]);

  useEffect(() => {
    const initAuth = async () => {
      if (cookies.accesstoken) setIsLoggedIn(true);
      if (token || isLoggedIn || cookies.accesstoken) {
        try {
          const userData = await authService.getMe();
          console.log(userData, "user info");
          setIsLoggedIn(true);
          isAuthenticated(true);
          setUser(userData.user);
          const isAdminUser = userData.user.role === "admin";
          setIsAdmin(isAdminUser);
          localStorage.setItem("isAdmin", isAdminUser);
        } catch (err) {
          console.error("Auth error:", err);
          setError(err.response?.data?.msg || "Authentication failed");
          // Clear auth state on error
          localStorage.removeItem("firstLogin");
          localStorage.removeItem("isLoggedIn");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token, cookies]);

  const addCart = async (product) => {
    if (!isLoggedIn) return alert("Please login to continue buying");

    const check = cart.every((item) => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        "/api/user/addcart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      alert("This product has been added to the cart");
    }
  };

  // Register method
  const register = async (userData) => {
    try {
      setError(null);
      const data = await authService.register(userData);
      
      if (data.requiresApproval) {
        return { success: true, requiresApproval: true, message: data.msg };
      }
      
      if (data.accesstoken) {
        // Auto-login after successful registration
        const userData = await authService.getMe();
        setUser(userData.users);
        setIsLoggedIn(true);
        isAuthenticated(true);
        userData.users.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
        return { success: true, requiresApproval: false };
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
      throw err;
    }
  };

  // Login method
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await authService.login(credentials);
      
      if (data.limitedAccess) {
        setUser({ ...data, status: 'PENDING' });
        setIsLoggedIn(true);
        return { success: true, limitedAccess: true, message: data.msg };
      }
      
      const userData = await authService.getMe();
      console.log({userData}, "logged in user data");
      setUser(userData.user);
      setIsLoggedIn(true);
      isAuthenticated(true);
      const isAdminUser = userData.user.role === "admin";
      setIsAdmin(isAdminUser);
      localStorage.setItem("isAdmin", isAdminUser);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
      throw err;
    }
  };

  // Logout method
  const logout = () => {
    authService.logout();
    setUser(initialState);
    setIsLoggedIn(false);
    isAuthenticated(false);
    setIsAdmin(false);
    localStorage.removeItem("isAdmin");
  };

  return {
    isLoggedIn: [isLoggedIn, setIsLoggedIn],
    isAdmin: [isAdmin, setIsAdmin],
    history: [history, setHistory],
    user: [user, setUser],
    cart: [cart, setCart],
    addCart: addCart,
    authenticated: [authenticated, isAuthenticated],
    loading: [loading, setLoading],
    error: [error, setError],
    register,
    login,
    logout
  };
}

export default UserAPI;
