//test works
// app.get("/", (req, res) => {
//   const sqlInsert =
//     "INSERT INTO right2drivedb (firstname, lastname, email, phone, date) VALUES ('tttonnyy', 'jonny','jonny@gmail.com', '11111114444', '04/10/2022')";
//   db.query(sqlInsert, (error, result) => {
//     console.log("error", error);
//     console.log("result", result);
//     res.send("Hello Express");
//   });
// });

const express = require("express");
const router = express.Router({});

let users = {};

/**
 * @openapi
 * /user:
 *   post:
 *     description: Creates a user!
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: Creates a user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The user ID.
 *                       example: 1
 *                     name:
 *                       type: string
 *                       description: The user's name.
 *                       example: Jone Doe
 *                     email:
 *                       type: string
 *                       description: The user's name.
 *                       example: Jone Doe
 */
router.post("/", async (req, res, next) => {
  if (!req.body.hasOwnProperty("email")) {
    res.status(400).send("User email is mandatory!");
    return;
  }

  if (!req.body.hasOwnProperty("firstname")) {
    res.status(400).send("Firstname is mandatory!");
    return;
  }

  const id = req.body.email;
  if (users[id] !== undefined) {
    res.status(400).send("User already exist, use PUT for update!");
    return;
  }

  users[id] = {
    id: req.email,
    user: req.firstname,
    email: req.email,
  };

  res.status(200).send(users);
});

//Read
router.get("/", async (req, res, next) => {
  const result = [];
  for (const [key, user] of Object.entries(users)) {
    result.push(user.email);
  }
  res.status(200).send(result);
});

router.get("/:id", async (req, res, next) => {
  if (req.params.id == undefined) {
    res.status(404).send("User email is mandatory!");
    return;
  }

  if (users[req.params.id] == undefined) {
    res.status(404).send("User not found!");
    return;
  }

  const user = {
    username: users[req.params.id].user,
    email: users[req.params.id].email,
  };
  res.status(200).send(user);
});

//Update
router.put("/:id", async (req, res, next) => {
  if (users[req.params.id] == undefined) {
    res.status(404).send("User not found!");
    return;
  }
  let user = users[req.params.id];

  if (req.body.hasOwnProperty("email")) {
    user.email = req.body.email;
  }

  if (req.body.hasOwnProperty("username")) {
    user.user = req.body.username;
  }

  if (req.body.hasOwnProperty("password")) {
    user.password = req.body.password;
  }

  res.status(200).send();
});

//Delete
router.delete("/:id", async (req, res, next) => {
  if (req.params.id == undefined) {
    res.status(400).send("User email is mandatory!");
    return;
  }

  if (users[req.params.id] !== undefined) {
    users.delete[req.params.id];
  }
  res.status(200).send({ status: "ok" });
});

module.exports = router;
