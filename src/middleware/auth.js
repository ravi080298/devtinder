var cookieParser = require("cookie-parser");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies;
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }
    const decoded = await jwt.verify(token.token, "secretkey");
    const _id = decoded._id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).send("Unauthorized: User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send("Unauthorized: Invalid token");
  }
};

module.exports = {
  userAuth,
};
