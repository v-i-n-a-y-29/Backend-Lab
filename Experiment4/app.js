const express = require('express')
const connectDB = require('../Experiment4/db/databaseConnection')
const app = express()
// Add middleware to parse JSON and URL-encoded request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const taskModel = require('../Experiment4/models/task-Model')

app.get('/', function (req, res) {
    res.send('hello world')
})

//get ----------------------
app.get('/tasks', async (req, res) => {
    try {
        // read the page number and limit from the url
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // to calc how many documents to skip
        // 15 = content
        // limit =5 , total pages = 3
        // page = 2
        // skip = 1
        const skip = (page-1)*limit;
        const tasks = await taskModel.find({}).skip(skip).limit(limit);
        
        // count the total tasks
        const totalTasks = await taskModel.countDocuments();
        
        // count the total pages
        const totalPages = Math.ceil(totalTasks/limit)
        // 14 / 5 = 2.8 -> 3

        return res.status(200).json({
            total: totalTasks,
            totalPagespage: totalPages,
            currentPage:page,
            limit: limit,
            data: tasks
        });
    } 
    catch (err) 
    {
        return res.status(500).json({ error: err.message })
    }
})
// post -------------------------
app.post('/tasks', async(req, res) => {
    // Log the request body to debug
    console.log('Request body:', req.body);
    
    // Check if req.body is defined and handle both JSON and form data
    if (!req.body) {
        return res.status(400).json({ error: 'Request body is missing' });
    }
    
    // Extract name safely with a fallback
    const name = req.body.name;
    
    if (!name) {
        return res.status(400).json({ error: 'Task name is required' });
    }
    
    try {
        // Create and save in one step - no need for separate save()
        const newtask = await taskModel.create({ name });
        return res.status(201).json(newtask);
    } 
    catch (err) 
    {
        return res.status(500).json({ error: err.message });
    }
})

// update (PUT) using name -------------------------
app.put('/tasks/byname/:name', async (req, res) => {
    try {
        const taskName = req.params.name;
        const { newName, isCompleted } = req.body;

        const updateData = {};
        if (newName !== undefined) updateData.name = newName;
        if (isCompleted !== undefined) {
            updateData.isCompleted = isCompleted;
            updateData.completedAt = isCompleted ? new Date() : null;
        }

        const updatedTask = await taskModel.findOneAndUpdate(
            { name: taskName },
            updateData,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json(updatedTask);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});



// delete (DELETE) using name ----------------------
app.delete('/tasks/byname/:name', async (req, res) => {
    try {
        const taskName = req.params.name;

        const deletedTask = await taskModel.findOneAndDelete({ name: taskName });

        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }

        return res.status(200).json({ message: "Task deleted successfully", deletedTask });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
});



app.listen(3000, async () => {
    console.log("App is running on port 3000");
    await connectDB('mongodb://localhost:27017/todolist')
});