const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");

const { userAuth } = require("../middleware/auth");
const User = require("../modal/user");
const {
  validateUserAllowedData,
  validateuserSkills,
} = require("../middleware/datavlidation");
const { validateSignUpData } = require("../utils/validatesignup");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
authRouter.use(express.json());
authRouter.use(cookieParser());

authRouter.post(
  "/signup",
  validateUserAllowedData,
  validateuserSkills,
  validateSignUpData,
  async (req, res) => {
    const user = new User(req.body);

    try {
      user.password = await user.passwordHash(user.password);
      await user.save();
      res.status(200).send("User created successfully");
    } catch (error) {
      console.log(error);
      res.status(400).send("Error creating user", error);
    }
  },
);

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(400).send("Invalid credentials");
    } else {
      const isPasswordValid = await user.passwordMatch(password);
      if (isPasswordValid) {
        const token = await user.getJwt();
        res.cookie("token", token);
        res.status(200).send("Login successful");
      } else {
        res.status(400).send("Invalid credentials");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(400).send("Error logging in", error);
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.cookie("token", "", { expires: new Date(0) });
    res.status(200).send("Logged out successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("Error logging out", error);
  }
});

authRouter.post("/forgot/password", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const { newPassword, confirmPassword } = req.body;
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .send("New password and confirm password do not match");
    }
    user.password = await user.passwordHash(newPassword);
    await user.save();
    res.status(200).send("Password changed successfully");
  } catch (error) {
    console.log(error);
    res.status(400).send("Error changing password", error);
  }
});

module.exports = authRouter;
