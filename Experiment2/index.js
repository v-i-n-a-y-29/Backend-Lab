// todo list
// server-express.js
const express = require("express");
const app = express();

// Parse both JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let tasks = [
  { id: 1, name: "Learn Node.js"},
  { id: 2, name: "Practice Express" }
];

// GET all tasks
app.get("/tasks", (req, res) => {
  res.json(tasks);
});

// POST new item
app.post("/tasks", (req, res) => {
  const name = req.body.name;
  
  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }
  
  const newTask = { id: tasks.length + 1, name: name };
  tasks.push(newTask);
  res.status(201).json({ message: "Item added", tasks });
});

// PUT (update an item)
app.put("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  
  if (!req.body.name) {
    return res.status(400).json({ message: "Name is required" });
  }
  
  tasks[taskIndex].name = req.body.name;
  res.json({ message: "Task updated", tasks });
});

// DELETE an item
app.delete("/tasks/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ message: "Task deleted", tasks });
});

// Start server
app.listen(3000, () => {
  console.log("Express Server running at http://localhost:3000");
});
