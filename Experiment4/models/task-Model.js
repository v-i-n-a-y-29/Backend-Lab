const mongoose=require('mongoose')

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  completedAt: {
    type: Date,
    default: null
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  // Enable virtuals to be included in JSON output
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add a virtual property for the length of the task name
taskSchema.virtual('nameLength').get(function() {
  return this.name.length;
});


module.exports = mongoose.model('task' , taskSchema)