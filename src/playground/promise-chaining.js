import '../db/mongoose.js';
import User from '../model/user.js';
import Task from '../model/task.js';

// 60a0bc4896b1f10c32f78fcc
// 60a32cd74a9a2810809e7708


// with normal promise method

// User.findByIdAndUpdate("60a0bc4896b1f10c32f78fcc", { age: 22 }).then((data) => {
//     console.log("data", data);
//     return User.countDocuments({ age : 22 });
// }).then((result) => {
//     console.log("result", result);
// }).catch((e) => {
//     console.log(e);
// });

// with async to practice
const updateAgeAndCount = async (id, age) => {
    const findAllUser = await User.find({});
    const user = await User.findByIdAndUpdate(id, { age });
    const count = await User.countDocuments({ age });
    // return findAllUser;
    return age;
};

updateAgeAndCount("60a0bc4896b1f10c32f78fcc", 55).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
});