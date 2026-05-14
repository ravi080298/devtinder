const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    toUserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: `{VALUE} is not a valid status`,
      },
    },
  },
  {
    timestamps: true,
  },
);

connectionRequestSchema.index({ fromUserID: 1 });

connectionRequestSchema.pre("save", async function () {
  const connection = this;
  if (connection.fromUserID.equals(connection.toUserID)) {
    throw new Error("Cannot send connection request to yourself");
  }
});

module.exports = mongoose.model("ConnectionRequest", connectionRequestSchema);
