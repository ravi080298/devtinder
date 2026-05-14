const express = require("express");
const connectionRouter = express.Router();

const ConnectionRequest = require("../modal/connection");

const { userAuth } = require("../middleware/auth");

connectionRouter.post(
  "/request/send/:status/:touserID",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { status, touserID } = req.params;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status type");
      }

      const isExistingRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserID: fromUserId, toUserID: touserID },
          { fromUserID: touserID, toUserID: fromUserId },
        ],
      });
      if (isExistingRequest) {
        return res.status(400).send("Connection request already exists");
      }
      const connection = new ConnectionRequest({
        fromUserID: fromUserId,
        toUserID: touserID,
        status,
      });
      // console.log(connection);
      await connection.save();
      res.status(200).send("Connection request sent successfully");
    } catch (error) {
      console.log(error);
      res.status(400).send("Error sending connection request", error);
    }
  },
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status type");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserID: loggedInUser._id,
        status: "interested",
      });
      console.log(connectionRequest);
      if (!connectionRequest) {
        return res.status(400).send("Connection request not found");
      }
      connectionRequest.status = status;
      await connectionRequest.save();
      res.status(200).send(`Connection request ${status} successfully`);
    } catch (error) {
      res.status(400).send("Error reviewing connection request", error);
    }
  },
);

module.exports = connectionRouter;
