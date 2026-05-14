const express = require("express");
const app = express();

const { connectDB } = require("./config/database");

const authRouter = require("./router/authrouter");
const profileRouter = require("./router/prfilerouter");
const connectionRouter = require("./router/connectionrouter");
const userRouter = require("./router/userrouter");

app.use("/", authRouter, profileRouter, connectionRouter, userRouter);
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
