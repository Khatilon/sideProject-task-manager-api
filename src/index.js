import express from 'express';
// let the db conneect
import path from 'path';
import cookieParser from 'cookie-parser';
import './db/mongoose.js';
// import model
import User from './model/user.js';
import Task from './model/task.js';
import userRouter from './routers/user.js';
import taskRouter from './routers/task.js';
 
const __dirname = path.resolve();
console.log("__dirname", __dirname);

const app = express();
app.use(express.static(__dirname + '/client/dist'));
// console.log("express() content", app);
// console.log("express.Route()", express.Router());

// process.env.PORT for deploy Hiroku
const port = process.env.PORT || process.env.LOCAL_PORT;

// set the middleware
// app.use是一種middleware, 如果設在這裡會先執行

// For example

// app.use((req, res, next) => {
//     console.log(req.method, req.path);

//     // 必須要call next(), 否則打postman會停住 但有些狀況確實不要讓流程跑到下一步 就不能加next
//     if (req.method === "GET") {
//         res.send('GET requires are disabled');
//     } else {
//         next();
//     }
// });

// let us can get data which type is json
app.use(express.json());

// 後續可以使用req.cookies取得回傳的object的cookie資料
app.use(cookieParser());

// register router to let url: localhost:3003/testUser can reply the result
// 在前後端分離中不需要這步, 因為後端只專門啟server提供API進入點
app.use(userRouter);
app.use(taskRouter);


// without middleware: new request -> run route handler
// with middleware:    new request -> do something -> run route handler


// 注意 DDE 並沒有採用類似app.use(userRouter)來分router 而是直接用以下mark的方式來call router

// For example

// app.get('/users', async (req, res) => {
//     try {
//         const users = await User.find({});
//         res.send(users);
//     } catch (e) {
//         res.status(500).send();
//     }
// });

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname + '/client/dist', 'index.html'));
  });

app.listen(port, () => {
    console.log('Server is on port', process.env.LOCAL_PORT);
});

const main = async () => {
    /* 下面三行code是知道taskId 回頭找user */
    // Populate allows us to populate data from a relationship such as the data we have right here for owner.
    // It's going to find the user who's associated with this task.
    // 此動作將會對owner這個參數裡面的值做填充, 本來只會有純粹的一個objectId 現在直接填充了整個對應到的User model的資料
    const task = await Task.findById('60bcc53bf7e1f60c7b7f3d59');
    await task.populate('owner').execPopulate();
    // console.log(task.owner);

    /* 下面三行code是知道userId 回頭找task */
    const user = await User.findById('60bcc018ad7b290bcae30ab6');
    await user.populate('myTasks').execPopulate();
    // 一定要用.myTasks才能找到 因為他是virtual的 不是實際的
    // console.log(user.myTasks);
};

// main();