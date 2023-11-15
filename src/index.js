const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Hello world everyone");
});

mongoose
  .connect(
    `mongodb+srv://tu:${process.env.MONGO_DB}@cluster0.fczqqkn.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log("connect success");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(port, () => {
  console.log("Server is running in port:  ", +port);
});
