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

// const {
//   getHouses,
//   deleteHouse,
//   createHouse,
//   updateHouse,
// } = require("./controller.js");

//------------
const houses = require(path.join(__dirname, "./db.json"));
rollbar.log(houses);
let houseID = 4;

// module.exports = {
const getHouses = (req, res) => {
  res.status(200).send(houses);
};
const deleteHouse = (req, res) => {
  const index = houses.findIndex((e) => e.id === +req.params.id);
  houses.splice(index, 1);
  res.status(200).send(houses);
};
const createHouse = (req, res) => {
  const { address, price, imageURL } = req.body;
  let newHouse = {
    id: houseID,
    address,
    price,
    imageURL,
  };
  if (address === "") {
    rollbar.error("no address added");
  } else {
    rollbar.log("new house added successfully");
    houses.push(newHouse);
    houseID++;
    res.status(200).send(houses);
  }
};
const updateHouse = (req, res) => {
  const id = req.params.id;
  const type = req.body.type;
  const index = houses.findIndex((e) => e.id === +id);
  if (type === "minus" && houses[index].price >= 10000) {
    houses[index].price -= 10000;
    res.status(200).send(houses);
  } else if (type === "plus") {
    houses[index].price += 10000;
    res.status(200).send(houses);
  } else {
    res.status(400).send("request failed");
  }
};
// };
//------------------

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
