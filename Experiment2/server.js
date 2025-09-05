const express = require('express');
const app = express();

// ## MIDDLEWARE ##
// These lines parse the incoming request bodies.
// This is the key to fixing the error. It MUST come before your routes.
app.use(express.json()); // For parsing application/json
// I was getting error and then i added a middleware for parsing the data
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

let users = [
  { id: 1, name: "Vinay" },
  { id: 2, name: "semwal" }
];

// ---  GET routes ---
app.get('/users', function(req, res) {
  res.json(users);
});

app.get('/users/:id', function(req, res) {
  const user = users.filter((u) => {
    return u.id === parseInt(req.params.id);
  });
  res.json(user);
});


// --- POST Method to create or to submit some data ---
app.post('/users', function(req, res) {

  console.log('Request Body:', req.body);

  // The middleware above will create req.body.
  // Now, req.body.name will exist.
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);
  res.status(201).json(users);
});

// ---PUT mehtod to update or replace a data
// 3. PUT (Update/Replace Data)
// ------------------
app.put("/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).send("User not found");

  user.name = req.body.name; // replace data
  res.json(user);
});

// 4. DELETE (Remove Data)
// ------------------
app.delete("/users/:id", (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.send("User deleted");
});



app.listen(3000, () => {
  console.log("App is running on port 3000");
});