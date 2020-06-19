const express = require("express");
const carsRouter = require("./carsRouter");
const { custom404, errorHandling } = require("./errors");

const server = express();
server.use(express.json());

server.get("/api", (req, res) => {
  res.status(200).json({ message: "API is up" });
});
server.use("/api/cars", carsRouter);

server.all("*", custom404);
server.use(errorHandling);

module.exports = server;
