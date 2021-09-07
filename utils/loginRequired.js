
const loginRequired = (req, res, next) => {
  return (req.user ? next() : res.status(401).json({message: 'Unauthorized user'}));
}

export default loginRequired;
