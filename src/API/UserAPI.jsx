import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { auth, apiLocal } from "../lib/stormGate";

const isAdminRole = (role) => role === 1 || role === "admin";

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
      if (token || cookies.accesstoken) {
        try {
          const userData = await auth.getMe();
          console.log(userData, "user info");
          setIsLoggedIn(true);
          isAuthenticated(true);
          setUser(userData.user);
          const isAdminUser = isAdminRole(userData.user?.role);
          setIsAdmin(isAdminUser);
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("isAdmin", isAdminUser);
        } catch (err) {
          console.error("Auth error:", err);
          setError(err.response?.data?.msg || "Authentication failed");
          setIsLoggedIn(false);
          isAuthenticated(false);
          setIsAdmin(false);
          setUser(initialState);
          localStorage.removeItem("firstLogin");
          localStorage.removeItem("isLoggedIn");
          localStorage.removeItem("isAdmin");
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token, cookies.accesstoken]);

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

  // Register — always force admin-approval gate via status:PENDING.
  // The backend may still echo APPROVED for legacy reasons; trust whatever
  // it returns and branch on data.status / data.accesstoken.
  const register = async (userData) => {
    try {
      setError(null);
      const data = await auth.register({ ...userData, status: "PENDING", application: "blog"  });

      // Mirror the registration into the blog DB so this app has a Users row.
      // Storm-Gate is the source of truth; if this fails, the auth middleware's
      // just-in-time upsert will heal the record when the user is approved + logs in.
      try {
        await apiLocal.post("/api/user/register", {
          name: userData.name,
          email: userData.email,
        });
      } catch (mirrorErr) {
        console.warn("Blog-side register mirror failed:", mirrorErr?.response?.data?.msg || mirrorErr.message);
      }

      // PENDING / DENIED responses do NOT carry an access token.
      if (data?.status === "PENDING" || data?.status === "DENIED") {
        return { status: data.status, message: data.msg, email: userData.email };
      }

      if (data?.accesstoken) {
        const me = await auth.getMe();
        setUser(me.user);
        setIsLoggedIn(true);
        isAuthenticated(true);
        const isAdminUser = isAdminRole(me.user?.role);
        setIsAdmin(isAdminUser);
        localStorage.setItem("isAdmin", isAdminUser);
        return { status: "APPROVED" };
      }

      // Defensive: shouldn't happen, but treat as pending.
      return { status: "PENDING", message: data?.msg, email: userData.email };
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
      throw err;
    }
  };

  // Login — Storm-Gate refuses PENDING/DENIED users by returning
  // a 200 body with `status` instead of an `accesstoken`. Branch on it.
  const login = async (credentials) => {
    try {
      setError(null);
      const data = await auth.login(credentials);

      if (data?.status === "PENDING" || data?.status === "DENIED") {
        return { status: data.status, message: data.msg, email: credentials.email };
      }

      const me = await auth.getMe();
      setUser(me.user);
      setIsLoggedIn(true);
      isAuthenticated(true);
      const isAdminUser = isAdminRole(me.user?.role);
      setIsAdmin(isAdminUser);
      localStorage.setItem("isAdmin", isAdminUser);
      return { status: "APPROVED", user: me.user };
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
      throw err;
    }
  };

  // Logout method
  const logout = () => {
    auth.logout();
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
