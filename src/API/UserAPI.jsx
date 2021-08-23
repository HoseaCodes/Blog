import { useState, useEffect } from "react";
import axios from "axios";

function UserAPI(token) {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [history, setHistory] = useState([]);

	useEffect(() => {
		if (token) {
			const getUser = async () => {
				try {
					const res = await axios.get("/api/user/infor", {
						headers: { Authorization: token },
					});
					console.log(res.data)
					console.log('yo')
					setIsLoggedIn(true);
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
	};
}

export default UserAPI;
