require("dotenv").config();

const express = require("express");
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
  //console.log("In users")
  const sqlGet = "SELECT * FROM right2drivedb";
  // headers = { "cache-control": "no-cache" };
  // body = { status: "available" };
  db.query(sqlGet, (error, result) => {
   // console.log(error.message)
    res.status(200).json(result);
  });
});

// Read one user

/**
 * @openapi
 * /users/{id}:
 *  get:
 *    summary: Find a user by ID.
 *    description: Returns a single user
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
    res.status(200).json(result);
  });
});

// Post

/**
 * @openapi
 * /users:
 *  post:
 *    summary: Add a new user.
 *    description: Add a single user
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The user's firstname.
 *                 example: Leanne
 *               lastname:
 *                 type: string
 *                 description: The user's lastname.
 *                 example: Graham
 *               email:
 *                 type: email
 *                 description: The user's email.
 *                 example: test@ing.com
 *               phone:
 *                 type: tel
 *                 description: The user's phone number.
 *                 example: 023 123 45 67
 *               date:
 *                 type: date
 *                 description: The date that the user registers.
 *                 example: 2022/09/24
 *               city:
 *                 type: string
 *                 description: The city users pick.
 *                 example: Stockholm
 */

app.post("/users", async (req, res) => {
  const { firstname, lastname, email, phone, date, city } = req.body;
  const sqlInsert =
    "INSERT INTO right2drivedb(firstname, lastname, email, phone, date, city) VALUES(?, ?, ?, ?, ?, ?)";
  db.query(
    sqlInsert,
    [firstname, lastname, email, phone, date, city],
    (error, result) => {
      if (error) {
        console.log(error).status(404);
      }
      res.status(201).json({firstname});
    }
  );
});

// Put / Update

/**
 * @openapi
 * /users/{id}:
 *  put:
 *    summary: Uppdate an existing user.
 *    description: Update a single user
 *    parameters:
 *      - in: path
 *        name: id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The user's firstname.
 *                 example: Leanne
 *               lastname:
 *                 type: string
 *                 description: The user's lastname.
 *                 example: Graham
 *               email:
 *                 type: email
 *                 description: The user's email.
 *                 example: test@ing.com
 *               phone:
 *                 type: tel
 *                 description: The user's phone number.
 *                 example: 023 123 45 67
 *               date:
 *                 type: date
 *                 description: The date that the user registers.
 *                 example: 2022/09/24
 *               city:
 *                 type: string
 *                 description: The city users pick.
 *                 example: Stockholm
 */

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, phone, date, city } = req.body;
  const sqlUpdate =
    "UPDATE right2drivedb SET firstname = ?, lastname = ?, email = ?, phone = ?, date = ?, city = ? WHERE id = ?";
  db.query(
    sqlUpdate,
    [firstname, lastname, email, phone, date, city, id],
    (error, result) => {
      if (error) {
        console.log(error).status(400);
      }
      res.status(200).json(result);
    }
  );
});

// Delete user
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
    res.json();
  });
});

// Delete spans

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  const sqlRemove = "DELETE FROM right2drivedb WHERE id BETWEEN number1 and number2 = ?";
  db.query(sqlRemove, id, (error, result) => {
    if (error) {
      console.log(error);
    }
    res.json();
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
