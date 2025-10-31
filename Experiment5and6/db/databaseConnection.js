const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

const disconnectDB = async () => {
    await mongoose.disconnect();
    console.log('MongoDB disconnected...');
};

module.exports = { connectDB, disconnectDB };