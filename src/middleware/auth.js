const adminAuth = (req, res, next) => {
  const authToken = "xyz";
  const isAuthenticated = authToken === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized admin token");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const authToken = "xyz";
  const isAuthenticated = authToken === "xyz";
  if (!isAuthenticated) {
    res.status(401).send("Unauthorized user token");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
