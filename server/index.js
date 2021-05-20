const express = require("express");
const color = require("colors");
const dotenv = require("dotenv").config();
const { connect } = require("./db");
const socket = require('./socket.js');
var cors = require('cors')

const authRouter = require("./routes/auth");
const settingsRouter = require("./routes/settings");
const mainRouter = require("./routes/main");

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use("/api/auth", authRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/main", mainRouter);

const server = app.listen(port, () => {
  console.log(
    `Server is running in ${process.env.NODE_ENV} on port ${process.env.PORT} `
      .yellow.bold
  );
  connect();
});

socket.initSocketServer(server, {path: '/ws'});
