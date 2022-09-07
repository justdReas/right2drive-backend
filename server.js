require("dotenv").config();

const express = require("express");
const healthcheck = require("healthcheck");
const bodyParser = require("body-parser");
const mysql = require("mysql8");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOptions = require("./swagger.json");

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

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes

// Read
/**
 * @openapi
 * /users:
 *  get:
 *    summary: See all users
 *    description: Use to fetch all users
 *    responses:
 *      '200':
 *        description: A successful response
 */

app.get("/users", async (req, res) => {
  const sqlGet = "SELECT * FROM right2drivedb";
  headers = { "cache-control": "no-cache" };
  body = { status: "available" };
  db.query(sqlGet, (error, result) => {
    res.send(result).status(200);
  });
});

/**
 * @openapi
 * /users/{id}:
 *  get:
 *    summary: Find a user by ID.
 *    description: Returns a single user
 *    operationId: getUserById
 *    parameters:
 *      - in: path
 *        name: id
 *        description: ID of user to return
 *        required: true
 *        content:
 *          type: integer
 *          format: int64
 *    responses:
 *      '200':
 *        description: A successful operation
 */

app.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const sqlGet = "SELECT * FROM right2drivedb WHERE id = ?";
  db.query(sqlGet, id, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

// Post
/**
 * @openapi
 * /users:
 *  post:
 *    summary: Add a new user.
 *    description: Add a single user
 *    operationId: addUser
 *    parameters:
 *      - in: formData
 *        name: firstname
 *        description: First name of user
 *        required: true
 *        content:
 *          type: string
 *          format: string
 *      - in: formData
 *        name: lastname
 *        description: Last name of user
 *        required: true
 *        content:
 *          type: string
 *          format: string
 *      - in: formData
 *        name: email
 *        description: User's email address
 *        required: true
 *        content:
 *          type: string
 *          format: string
 *      - in: formData
 *        name: phone
 *        description: User's phone number
 *        content:
 *          type: string
 *          format: string
 *      - in: formData
 *        name: date
 *        description: Date
 *        required: true
 *        content:
 *          type: string
 *          format: string
 *    responses:
 *      '405':
 *        description: Invalid input
 */
app.post("/users", async (req, res) => {
  const { firstname, lastname, email, phone, date } = req.body;
  const sqlInsert =
    "INSERT INTO right2drivedb(firstname, lastname, email, phone, date) VALUES(?, ?, ?, ?, ?)";
  db.query(
    sqlInsert,
    [firstname, lastname, email, phone, date],
    (error, result) => {
      if (error) {
        console.log(error);
      }
      res.end();
    }
  );
});

// Delete
/**
 * @openapi
 * /users/{id}:
 *  delete:
 *    summary: Delete a user by ID.
 *    description: Delete a single user
 *    operationId: deleteUserById
 *    parameters:
 *      - in: path
 *        name: id
 *        description: ID of user to delete
 *        required: true
 *        content:
 *          type: integer
 *          format: int64
 *    responses:
 *      '200':
 *        description: A successful operation
 */
app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM right2drivedb WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.end();
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
