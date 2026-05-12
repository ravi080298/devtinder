const validator = require("validator");

const validateSignUpData = (req, res, next) => {
  const { firstName, emailId, password } = req.body;
  if (firstName.trim().length < 3 || firstName.trim().length > 50) {
    console.log(firstName.trim().length, "firstName length");
    return res
      .status(400)
      .send("First name must be between 3 and 50 characters");
  }
  if (!validator.isEmail(emailId)) {
    return res.status(400).send("Invalid email format");
  }
  if (password.length < 8) {
    return res.status(400).send("Password must be at least 8 characters long");
  }
  next();
};

module.exports = {
  validateSignUpData,
};
