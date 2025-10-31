const mongoose = require('mongoose')

const connectDB = (MONGODB_URI) => {
    console.log("db is connected");
    return mongoose.connect(MONGODB_URI)
}

module.exports = connectDB