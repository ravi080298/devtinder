const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const { validateSignUpData } = require("../utils/validatesignup");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error fetching profile", error);
  }
});

profileRouter.patch(
  "/profile/edit",
  userAuth,
  validateSignUpData,
  async (req, res) => {
    try {
      const user = req.user;
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined) {
          user[key] = req.body[key];
        }
      });
      await user.save();
      res.status(200).send("Profile updated successfully");
    } catch (error) {
      res.status(400).send("Error updating profile", error);
    }
  },
);

module.exports = profileRouter;
