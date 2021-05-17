const express = require("express");
const socket = require("socket.io");
const color = require("colors");
const dotenv = require("dotenv").config();
const { connect } = require("./db");
var cors = require('cors')

const authRouter = require("./routes/auth");
const settingsRouter = require("./routes/settings");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);

const server = app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${process.env.PORT} `
      .yellow.bold
  );
  connect();
});

const io = socket(server);

//everything related to io will go here
io.on("connection", (socket) => {
  console.log("connection");
});
