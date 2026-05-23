import Users from "../models/user.js";

// Requires `auth` middleware to have run first so req.user.id is populated from the JWT.
const authAdmin = async (req, res, next) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ msg: "Authentication required" });
    }

    const user = await Users.findById(req.user.id).select("role");
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    const isAdmin = user.role === 1 || user.role === "admin";
    if (!isAdmin) {
      return res.status(403).json({ msg: "Admin resources access denied" });
    }

    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export default authAdmin;
