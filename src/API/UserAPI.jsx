import { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

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
  websites: []
};

function UserAPI(token) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(initialState);
  const [authenticated, isAuthenticated] = useState(false);
  const [cart, setCart] = useState([]);
  const [cookies] = useCookies(["cookie-name"]);

  useEffect(() => {
    if (cookies.accesstoken) setIsLoggedIn(true);
    if (token || isLoggedIn || cookies.accesstoken) {
      const getUser = async () => {
        const accesstoken = token ? token : cookies.accesstoken;
        try {
          const res = await axios.get("/api/user/info", {
            headers: { Authorization: accesstoken }
          });
          console.log(res, "huh");
          setIsLoggedIn(true);
          isAuthenticated(true);
          setUser(res.data.users);
          res.data.users.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
        } catch (err) {
          alert(err.response.data.msg);
        }
      };
      getUser();
    }
  }, [token, cookies]);

  const addCart = async product => {
    if (!isLoggedIn) return alert("Please login to continue buying");

    const check = cart.every(item => {
      return item._id !== product._id;
    });

    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        "/api/user/addcart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token }
        }
      );
    } else {
      alert("This product has been added to the cart");
    }
  };

  return {
    isLoggedIn: [isLoggedIn, setIsLoggedIn],
    isAdmin: [isAdmin, setIsAdmin],
    history: [history, setHistory],
    user: [user, setUser],
    cart: [cart, setCart],
    addCart: addCart,
    authenticated: [authenticated, isAuthenticated]
  };
}

export default UserAPI;
