const express = require("express");
const cors = require("cors");
const { connect } = require("mongoose");

const UserRoute = require("./routes/user");
const ItemRoute = require("./routes/item");

const URL =
  "mongodb+srv://<user>:<password>@cluster0.ctusi.mongodb.net/donateApp?retryWrites=true&w=majority";
  
  
connect(URL, {})
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/users", UserRoute);
app.use("/donations", ItemRoute);

app.get("/", (req, res) => {
  res.send({
    message: "Welcome to donate app",
  });
});

app.listen(5000, () => console.log("server is running on the port: 5000"));
