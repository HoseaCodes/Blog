import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
	try {
		const token = req.header("Authorization");
		console.log('=== AUTH MIDDLEWARE ===');
		console.log('Token received:', token ? `${token.substring(0, 20)}...` : 'NO TOKEN');
		console.log('ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET);
		
		if (!token)
			return res.status(400).json({ msg: "Invalid Authentication - no token" });

		jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
			if (err) {
				console.log('JWT verification error:', err.name, err.message);
			}
      if (err instanceof jwt.TokenExpiredError) {
        return res.status(400).json({ msg: "Token Expired Error", err });
      }
      if (err)
				return res
					.status(400)
					.json({ msg: "Invalid Authentication - invalid token", details: err.message});

			console.log('Token verified successfully for user:', user.id);
			req.user = user;
			next();
		});
	} catch (err) {
		console.log('Auth middleware catch error:', err);
		return res.status(500).json({ msg: err.message });
	}
};

export default auth;
