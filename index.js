require("dotenv").config();

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql8");
const cors = require("cors");

const db = mysql.createPool({
  host: `${process.env.REACT_APP_HOST}`,
  user: `${process.env.REACT_APP_USER}`,
  password: `${process.env.REACT_APP_PASSWORD}`,
  database: `${process.env.REACT_APP_DATABASE}`,
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.get("/api/get", (req, res) => {
//   const sqlGet = "SELECT * FROM right2drivedb";
//   db.query(sqlGet, (error, result) => {
//     res.send(result);
//   });
// });

//test works
app.get("/", (req, res) => {
  const sqlInsert =
    "INSERT INTO right2drivedb (firstname, lastname, email, phone, date) VALUES ('tttonnyy', 'jonny','jonny@gmail.com', '11111114444', '04/10/2022')";
  db.query(sqlInsert, (error, result) => {
    console.log("error", error);
    console.log("result", result);
    res.send("Hello Express");
  });
});

//by deafult express server run under home route,we have to define this route , Cannot GET /
app.listen(4000, () => {
  console.log("server is listening on port 4000");
});
