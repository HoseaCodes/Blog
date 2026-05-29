// Requires `auth` middleware to have run first so req.user is populated
// (including role/email enriched from Storm-Gate's /me endpoint).
const authAdmin = (req, res, next) => {
  if (!req.user?.id) {
    return res.status(401).json({ msg: "Authentication required" });
  }

  const isAdmin = req.user.role === 1 || req.user.role === "admin";
  if (!isAdmin) {
    return res.status(403).json({ msg: "Admin resources access denied" });
  }

  next();
};

export default authAdmin;
