import '../db/mongoose.js';
import Task from '../model/task.js';

// add testData
// Task({description: 'TestData'}).save();

// with normal promise method
// Task.findByIdAndDelete("60a48e209bed5d1216d4724f").then((deleteData) => {
//     console.log(deleteData);
//     return Task.countDocuments({completed: false});
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);
// })

// with async to practice
const deleteTaskAndCount = async (id) => {
    const deleteItem = await Task.findByIdAndDelete(id);
    // if we don't need to get the result of deleteItem, we can only use "await Task.findByIdAndDelete(id);"
    const count = await Task.countDocuments({ completed: false });
    
    return {
        deleteItem,
        count
    };
};

deleteTaskAndCount("60a658ac81b215281b098bcc").then((result) => {
    console.log("deleteItem", result.deleteItem);
    console.log("count", result.count);
}).catch((e) => {
    console.log(e);
})
