const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/test", (req, res) => {
  res.send("Test route");
});

app.use("/namaste", (req, res) => {
  res.send("namste route");
});
const port = 3000;

app.listen(port);
