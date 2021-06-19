import mongoose from 'mongoose';

// model will bulit new collection as the name of tasks
const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

export default Task;