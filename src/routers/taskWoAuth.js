import express from 'express';
import Task from '../model/task.js';

// add router
const router = express.Router();

router.post('/tasks', async (req, res) => {
    const task = Task(req.body);
    try {
        const inputTask = await task.save();
        res.send(inputTask);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.get('/tasks', async (req, res) => {
    try {
        const findTasks = await Task.find({});
        res.send(findTasks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const findTask = await Task.findById(_id);
        if (!findTask) {
            res.status(400).send();
        }
        res.send(findTask);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdated = ['completed', 'description'];
    const isValidOperation = updates.every((item) => allowedUpdated.includes(item));

    if (!isValidOperation) {
        console.log("Invalid updates!");
        return res.status(400).send({ error: 'Invalid updates!'});
    }

    try {
        // const updateTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        const updateTask = await Task.findById(req.params.id);
        updates.forEach((item) => {
            updateTask[item] = req.body[item];
        });
        await updateTask.save();

        if (!updateTask) {
            return res.send(404).send({ error: 'Did not find the task!' });
        }
        res.send(updateTask);
    } catch (e) {
        console.log("nonono");
        res.status(400).send(e);
    }
});

router.delete('/tasks/:id', async (req, res) => {
    try {
        const deleteTask = await Task.findByIdAndRemove(req.params.id);

        if (!deleteTask) {
            res.status(404).send('Did not find the task!');
        }

        res.send(deleteTask);
    } catch (e) {
        res.status(500).send(e);
    }
});

export default router;