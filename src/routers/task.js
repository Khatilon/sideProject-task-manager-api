import express from 'express';
import auth from '../middleware/auth.js';
import Task from '../model/task.js';

// add router
const router = express.Router();

router.post('/tasks', auth, async (req, res) => {
    // post時, 先增加一個新的屬性叫owner, 並塞入auth得到的user id以便以後query出user是誰, 或是被user query出有哪些task
    const task = Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        const inputTask = await task.save();
        res.send(inputTask);
    } catch (e) {
        res.status(400).send(e);
    }
});

// get /tasks?completed=false
// get /tasks?limit=2&skip=5
// get /tasks?sortBy=createdAt:desc

router.get('/tasks', auth, async (req, res) => {
    console.log('Url query', req.query);
    try {
        // 法一 (好用！)
        // const findTasks = await Task.find({ owner: req.user._id });
        // const findTasks = await Task.find({ owner: req.user._id, completed: req.query.completed });
        // res.send(findTasks);

        const match = {};
        const sort = {};

        if (req.query.completed) {
            match.completed = req.query.completed === 'true'
        }

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        // 法二 (也可以！)
        // await req.user.populate('myTasks').execPopulate();
        console.log("req.query.limit", parseInt(req.query.limit));
        console.log("req.query.sortBy", sort);
        const queryNum = parseInt(req.query.limit);
        await req.user.populate({
            path: 'myTasks',
            // match不可以直接代 match: req.query, 會連同非completed的一起帶進去, 導致query不到
            match,
            options: {
                // limit: 2  // 一頁回兩筆資料
                // sort: {
                //     createdAt: -1,
                //     completed: 1
                // }
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();
        res.send(req.user.myTasks);
        
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // 由於現在需考慮auth的問題, 故須多query一項參數(owner)
        const findTask = await Task.findOne({ _id, owner: req.user._id });

        if (!findTask) {
            res.status(400).send('You are not auth!!');
        }
        res.send(findTask);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdated = ['completed', 'description'];
    const isValidOperation = updates.every((item) => allowedUpdated.includes(item));

    if (!isValidOperation) {
        console.log("Invalid updates!");
        return res.status(400).send({ error: 'Invalid updates!'});
    }

    try {
        const updateTask = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!updateTask) {
            return res.send(404).send();
        }

        updates.forEach((item) => {
            updateTask[item] = req.body[item];
        });

        await updateTask.save();
        res.send(updateTask);
        
    } catch (e) {
        console.log("nonono");
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const deleteTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
        // const deleteTask = await Task.findByIdAndRemove(req.params.id);
        if (!deleteTask) {
            res.status(404).send('Did not find the task!');
        }
        // .delete() 或 .remove() 都有用欸 或乾脆直接在上面用findOneAndDelete
        // await deleteTask.delete();

        res.send(deleteTask);
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;