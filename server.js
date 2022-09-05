require("dotenv").config();

const express = require("express");
const healthcheck = require("healthcheck");
const bodyParser = require("body-parser");
const mysql = require("mysql8");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./swagger.json");
const swaggerJsdoc = require("swagger-jsdoc");

const PORT = process.env.PORT || 4000;

const db = mysql.createPool({
  host: `${process.env.REACT_APP_HOST}`,
  user: `${process.env.REACT_APP_USER}`,
  password: `${process.env.REACT_APP_PASSWORD}`,
  database: `${process.env.REACT_APP_DATABASE}`,
});

const app = express();
app.use(express.json());
app.use("/health", require("./routes/healthcheck"));
app.use("/user", require("./routes/user"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/", (req, res) => {
  // const sqlGet = "SELECT * FROM right2drivedb";
  headers = { "cache-control": "no-cache" };
  body = { status: "available" };
  db.query(sqlGet, (error, result) => {
    res.send(result).status(200);
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
