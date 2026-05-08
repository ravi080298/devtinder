const express = require("express");
const app = express();

app.get("/user/:id/:name/:password", (req, res) => {
  console.log(req.params, "params");
  res.send({ firstName: "John", lastName: "Doe" });
});

app.post("/user", (req, res) => {
  res.send("Data successfully saved  to the database");
});

app.delete("/user", (req, res) => {
  res.send("Data successfully deleted from the database");
});

app.patch("/user", (req, res) => {
  res.send("Data successfully updated in the database");
});

app.put("/user", (req, res) => {
  res.send("Data successfully updated in the database");
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3000;

app.listen(port);
