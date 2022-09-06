app.delete("/:id", (req, res) => {
  const {id} = req.params;
  const sqlRemove = 
  "DELETE FROM right2drivedb WHERE id = ?";
  db.query(sqlRemove, id, (error, result) => {
     if (error) {
      console.log(error);
     }
  });
});





app.post("/", async (req, res) => {
  const {firstname, lastname, email, phone, date} = req.body;
  const sqlInsert = "INSERT INTO right2drivedb(firstname, lastname, email, phone, date) VALUES(?, ?, ?, ?, ?)";
  db.query(sqlInsert, [firstname, lastname, email, phone, date], (error, result) => {
     if (error) {
      console.log(error);
     }
     res.end();
  });
});


app.put("/users/:id", (req, res) => {
  const {id} = req.params;
  const {firstname, lastname, email, phone, date} = req.body;
  const sqlUpdate = "UPDATE  right2drivedb SET firstname = ?, lastname = ?, email = ?, phone = ?, date = ?, WHERE id = ?"; 
  db.query(sqlUpdate, [firstname, lastname, email, phone, date, id], (error, result) => {
     if(error) {
      console.log(error);     
     }
     res.send(result);
  });
});