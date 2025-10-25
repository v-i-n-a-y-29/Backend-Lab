// server-http.js
const http = require("http");

let tasks = [
  { id: 1, name: "Learn Node.js" },
  { id: 2, name: "Practice Express" }
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  // GET: Show all tasks
  if (req.method === "GET" && req.url === "/tasks") {
    res.end(JSON.stringify(tasks));
  }

  // POST: Add a new task
  else if (req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body);
      const newTask = { id: tasks.length + 1, name: data.name };
      tasks.push(newTask);
      res.end(JSON.stringify({ message: "Task added", tasks }));
    });
  }

  // PUT: Update a task by ID
  else if (req.method === "PUT" && req.url.startsWith("/tasks/")) {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      const data = JSON.parse(body);
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.name = data.name;
        res.end(JSON.stringify({ message: "Task updated", tasks }));
      } else {
        res.end(JSON.stringify({ message: "Task not found" }));
      }
    });
  }

  // DELETE: Remove a task by ID
  else if (req.method === "DELETE" && req.url.startsWith("/tasks/")) {
    const id = parseInt(req.url.split("/")[2]);
    tasks = tasks.filter(t => t.id !== id);
    res.end(JSON.stringify({ message: "Task deleted", tasks }));
  }

  // For all other routes
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
