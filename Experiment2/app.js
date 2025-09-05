// server-http.js
const http = require("http");

// Updated to have id and name properties
let tasks = [
  { id: 1, name: "Learn Node.js" },
  { id: 2, name: "Practice Express" }
];

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/tasks") {
    res.end(JSON.stringify(tasks));
  }

  else if (req.method === "POST" && req.url === "/tasks") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    // This new block understands both JSON and form data
    req.on("end", () => {
      try {
        let name;
        const contentType = req.headers['content-type'];

        if (contentType && contentType.includes('application/json')) {
          ({ name } = JSON.parse(body));
        } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(body);
          name = params.get('name');
        }

        if (!name || typeof name !== "string" || name.trim() === "") {
          res.statusCode = 400;
          return res.end(JSON.stringify({ message: "Task name is required" }));
        }

        // Find the highest existing ID
        const maxId = tasks.length > 0 ? Math.max(...tasks.map(task => task.id)) : 0;

        // Create the new task with the next sequential ID
        const newTask = { id: maxId + 1, name: name.trim() };
        tasks.push(newTask);
        res.statusCode = 201;
        res.end(JSON.stringify({ message: "Task added", tasks }));
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid data format" }));
      }
    });
  }


  else if (req.method === "DELETE" && req.url.startsWith("/tasks/")) {
    const id = parseInt(req.url.split("/")[2]);
    const initialLength = tasks.length;
    tasks = tasks.filter(task => task.id !== id);

    if (tasks.length === initialLength) {
      res.statusCode = 404;
      res.end(JSON.stringify({ message: "Not found" }));
    } else {
      res.end(JSON.stringify({ message: "Task deleted", tasks }));
    }
  }

  else if (req.method === "PUT" && req.url.startsWith("/tasks/")) {
    const id = parseInt(req.url.split("/")[2]);
    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        let name;
        const contentType = req.headers['content-type'];

        if (contentType && contentType.includes('application/json')) {
          ({ name } = JSON.parse(body));
        } else if (contentType && contentType.includes('application/x-www-form-urlencoded')) {
          const params = new URLSearchParams(body);
          name = params.get('name');
        }

        if (!name || typeof name !== "string" || name.trim() === "") {
          res.statusCode = 400;
          return res.end(JSON.stringify({ message: "Task name is required" }));
        }

        const task = tasks.find(task => task.id === id);

        if (!task) {
          res.statusCode = 404;
          res.end(JSON.stringify({ message: "Not found" }));
        } else {
          task.name = name.trim();
          res.end(JSON.stringify({ message: "Updated", tasks }));
        }
      } catch (error) {
        res.statusCode = 400;
        res.end(JSON.stringify({ message: "Invalid data format" }));
      }
    });
  }

  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
