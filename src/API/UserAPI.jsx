import { useState, useEffect } from "react";
import axios from "axios";

const initialState = {
    "role": 0,
    "name": "",
    "email": "",
    "password": "",
    "avatar": {},
    "title" : "",
    "location" : "",
    "work" : [],
    "education" : [],
    "skills" : [],
    "phone" : "",
    "socialMedia" : [],
    "websites" : [],
}

function UserAPI(token) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [history, setHistory] = useState([]);
  const [user, setUser] = useState(initialState);
  const [authenticated, isAuthenticated] = useState(false);

	useEffect(() => {
		if (token) {
			const getUser = async () => {
        try {
          const res = await axios.get("/api/user/info", {
            headers: { Authorization: token },
					});
					setIsLoggedIn(true);
          isAuthenticated(true);
          setUser(res.data);
					res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false);

				} catch (err) {
					alert(err.response.data.msg);
				}
			};
			getUser();
		}
	}, [token]);

	return {
		isLoggedIn: [isLoggedIn, setIsLoggedIn],
		isAdmin: [isAdmin, setIsAdmin],
		history: [history, setHistory],
    user: [user, setUser],
    authenticated: [authenticated, isAuthenticated],
	};
}

export default UserAPI;
