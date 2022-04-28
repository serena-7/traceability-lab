const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

const {
  getHouses,
  deleteHouse,
  createHouse,
  updateHouse,
} = require("./controller.js");

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

app.get("/api/houses", getHouses);
app.post("/api/houses", createHouse);
app.put("/api/houses/:id", updateHouse);
app.delete("/api/houses/:id", deleteHouse);

const port = process.env.PORT || 4560;

app.listen(port, () => console.log(`listening on ${port}`));
