const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

const { connectDB } = require("./config/database");
const {
  validateUserAllowedData,
  validateuserSkills,
} = require("./middleware/datavlidation");
const { userAuth } = require("./middleware/auth");
const User = require("./modal/user");
const { validateSignUpData } = require("./utils/validatesignup");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());

app.post(
  "/signup",
  validateUserAllowedData,
  validateuserSkills,
  validateSignUpData,
  async (req, res) => {
    const user = new User(req.body);

    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      user.password = passwordHash;
      await user.save();
      res.status(200).send("User created successfully");
    } catch (error) {
      console.log(error);
      res.status(400).send("Error creating user", error);
    }
  },
);

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(400).send("Invalid credentials");
    } else {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const token = await jwt.sign({ _id: user._id }, "secretkey");
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

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("Error fetching profile", error);
  }
});

app.get("/user", async (req, res) => {
  try {
    const emailId = req.body.emailId;
    const users = await User.findOne({ emailId: emailId });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(400).send("Error fetching feed", +error);
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    console.log(_id);
    const user = await User.findById(_id);
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Error fetching user", error);
  }
});

app.delete("/user/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.deleteOne({ _id: _id });
    if (user.deletedCount === 0) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    res.status(400).send("Error deleting user", error);
  }
});

app.put("/user", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { emailId: req.body.emailId },
      req.body,
      {
        new: true, // Return the modified document
        upsert: true, // Create it if it doesn't exist
        runValidators: true, // Ensure the new data obeys Schema rules
      },
    );
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Error updating user", error);
  }
});

// app.patch("/user/:id", async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const user = await User.findByIdAndUpdate(_id, req.body, {
//       new: true, // Return the modified document
//       runValidators: true, // Ensure the new data obeys Schema rules
//     });
//     if (!user) {
//       res.status(404).send("User not found");
//     } else {
//       res.status(200).send(user);
//     }
//   } catch (error) {
//     res.status(400).send("Error updating user", error);
//   }
// });
app.patch("/user", validateuserSkills, async (req, res) => {
  try {
    const _id = req.body.id;
    const gender = req.body.gender;
    if (!["male", "female", "others"].includes(gender.toLowerCase())) {
      res
        .status(400)
        .send(
          "Invalid gender value. Allowed values are 'male', 'female', 'others'.",
        );
      return;
    }
    const user = await User.findByIdAndUpdate(_id, req.body, {
      new: true, // Return the modified document
      runValidators: true, // Ensure the new data obeys Schema rules
    });
    if (!user) {
      res.status(404).send("User not found");
    } else {
      res.status(200).send(user);
    }
  } catch (error) {
    res.status(400).send("Error updating user", error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      res.status(404).send("No users found");
    } else {
      res.status(200).send(users);
    }
  } catch (error) {
    res.status(400).send("Error fetching feed", +error);
  }
});

connectDB()
  .then(() => {
    console.log("Connected to DB");
    app.listen(3000, () => {
      console.log("Server started on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error connecting to DB", err);
  });
