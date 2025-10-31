const express = require('express')
const connectDB = require('../Experiment5 & 6/db/databaseConnection')
const app = express()
// Add middleware to parse JSON and URL-encoded request bodies
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const taskModel = require('../Experiment5 & 6/models/task-Model')
const userModel = require('../Experiment5 & 6/models/user-Model')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const auth = require('./middleware/auth');
const authorize = require('./middleware/authorize');

const JWT_SECRET = 'your_jwt_secret_key'; // Replace with a strong secret, preferably from environment variables

app.get('/', function (req, res) {
    res.send('hello world')
})

//get ----------------------
app.get('/tasks', auth, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;

        const tasks = await taskModel.find({ owner: req.user._id }).skip(skip).limit(limit);
        const totalTasks = await taskModel.countDocuments({ owner: req.user._id });

        return res.status(200).json({
            total: totalTasks,
            page: Math.floor(skip / limit) + 1,
            limit: limit,
            data: tasks
        });
    } 
    catch (err) 
    {
        return res.status(500).json({ error: err.message })
    }
})

// Admin-only route to get all tasks
app.get('/admin/tasks', auth, authorize(['admin']), async (req, res) => {
    try {
        const tasks = await taskModel.find({});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Registration
app.post('/users/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Create a new user
        const user = new userModel({
            name,
            email,
            password,
            role
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', userId: user._id });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User Login
app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        // Create and sign a JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: '1h' }, // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.json({ 
                    message:'user logged in successfully',
                    token });
            }
        );

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// post -------------------------
app.post('/tasks', auth, async(req, res) => {
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
        const newtask = await taskModel.create({ name, owner: req.user._id });
        return res.status(201).json(newtask);
    } 
    catch (err) 
    {
        return res.status(500).json({ error: err.message });
    }
})

// update (PUT) using name -------------------------
app.put('/tasks/byname/:name', auth, async (req, res) => {
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
            { name: taskName, owner: req.user._id },
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
app.delete('/tasks/byname/:name', auth, async (req, res) => {
    try {
        const taskName = req.params.name;

        const deletedTask = await taskModel.findOneAndDelete({ name: taskName, owner: req.user._id });

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