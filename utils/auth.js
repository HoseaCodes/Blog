import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
	try {
		const token = req.header("Authorization");
		if (!token)
			return res.status(400).json({ msg: "Invalid Authentication - no token" });

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err instanceof jwt.TokenExpiredError) {
        return res
        .status(400)
        .json({ msg: "Token Expired Error", err});
      }
      if (err)
				return res
					.status(400)
					.json({ msg: "Invalid Authentication - invalid token"});

			req.user = user;
			next();
		});
	} catch (err) {
		return res.status(500).json({ msg: err.message });
	}
};

export default auth;
