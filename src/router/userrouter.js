const express = require("express");

const userRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../modal/connection");
const User = require("../modal/user");

userRouter.get("/user/request/receive", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const connectionRequests = await ConnectionRequest.find({
      toUserID: user._id,
      status: "interested",
    }).populate("fromUserID", "firstName lastName");
    console.log(connectionRequests);
    res.status(200).send({
      message: "Connection requests fetched successfully",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error fetching connection requests",
      error: error,
    });
  }
});

userRouter.get("/user/connection", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const connections = await ConnectionRequest.find({
      $or: [{ fromUserID: user._id }, { toUserID: user._id }],
      status: "accepted",
    }).populate("fromUserID toUserID", "firstName lastName");
    res.status(200).send({
      message: "Connections fetched successfully",
      data: connections,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error fetching connections",
      error: error,
    });
  }
});

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const userLoggeedIn = req.user;
    const pageNo = parseInt(req.query.pageNo) || 1;
    const size = parseInt(req.query.size) || 10;
    let skip = (pageNo - 1) * size;
    const connectionsRequests = await ConnectionRequest.find({
      $or: [{ fromUserID: userLoggeedIn._id }, { toUserID: userLoggeedIn._id }],
      status: "accepted",
    }).select("fromUserID toUserID");

    const hideUsersFromFeed = new Set();
    connectionsRequests.forEach((connection) => {
      hideUsersFromFeed.add(connection.fromUserID.toString());
      hideUsersFromFeed.add(connection.toUserID.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: userLoggeedIn._id } },
      ],
    })
      .select("firstName lastName emailId")
      .skip(skip)
      .limit(size);
    res.status(200).send({
      message: "Feed fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).send({
      message: "Error fetching feed",
      error: error,
    });
  }
});

module.exports = userRouter;
