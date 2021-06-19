import mongoose from 'mongoose';

// model will bulit new collection as the name of tasks
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref可以用來將此筆field reference到另外一個model的概念
        // 這邊的ref到的model就是User, 可以去看model裡面的user這隻檔案 最下面有個 const User = mongoose.model('User', userSchema);
        // Now that we have this in place, we can easily fetch the entire user profile whenever we have access
        ref: 'User'
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;