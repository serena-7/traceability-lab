const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../")));

// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: "599fc637f9d04bbcad4f18e4556aeaaf",
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const {
  getHouses,
  deleteHouse,
  createHouse,
  updateHouse,
} = require("./controller.js");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
  rollbar.info("html file served successfully.");
});

app.get("/api/houses", getHouses);
app.post("/api/houses", createHouse);
app.put("/api/houses/:id", updateHouse);
app.delete("/api/houses/:id", deleteHouse);

const port = process.env.PORT || 4560;

app.use(rollbar.errorHandler());
app.listen(port, () => console.log(`listening on ${port}`));
