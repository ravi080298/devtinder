const express = require("express");
const app = express();

const { connectDB } = require("./config/database");
const User = require("./modal/user");
app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    res.status(200).send("User created successfully");
  } catch (error) {
    res.status(400).send("Error creating user", +error);
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

app.patch("/user/:id", async (req, res) => {
  try {
    const _id = req.params.id;
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
