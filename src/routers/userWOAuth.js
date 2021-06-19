import express from 'express';
import User from '../model/user.js';
import auth from '../middleware/auth.js';

// add router
const router = express.Router();

router.get('/testUser', (req, res) => {
    res.send('From a new file');
});

router.post('/users', async (req, res) => {
    const user = User(req.body);
    // without async 
    // user.save().then((data) => {
    //     res.send(data);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });

    // with async
    try {
        await user.save();
        // 儲存完user資料後 開始給token並再存一次
        const token = await user.generateAuthToken();
        res.send({
            user,
            token
        });
    } catch (e) {
        // if user input less password, the user use throw new error
        // so it will enter catch function
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        // 注意 這裡是我們自己創造一個function叫做findByCredentials給schema, 所以model端要呼叫時必須用userSchema.statics.findByCredentials來呼叫
        // https://riptutorial.com/mongoose/example/10574/schema-statics
        console.log(req.body);
        const user = await User.findByCredentials(req.body.email, req.body.password);

        // 增加token辨識使用者
        // 注意 這裡是我們自己創造一個function叫做generateAuthToken給schema實例, 所以model端要呼叫時必須用userSchema.methods.generateAuthToken來呼叫
        const token = await user.generateAuthToken();
        res.send({
          // 需要把一些隱密資料隱藏起來不要全部透過API丟回去
          // 透過userSchema.methods.toJSON
          user,
          token   
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

// router.METHOD(path, [callback, ...] callback)

router.post('/users/logout', auth, async (req, res) => {
    try {
         req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
         await req.user.save(); // req.user已經是User的instance了, 所以可以直接.save()
         res.send(`Hey, you logout! And you have deleted the token : ${req.token}`);
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send('Hey, you wipe out all the token!');
    } catch (e) {
        res.status(500).send();
    }
});


router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/users/me', auth, async (req, res) => {
    try {
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }
});

// 已經被 /users/me 這個router所取代了
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }

    try {
        // new is return the modified document rather than the original.
        // runValidators will ensure run the valiadition for update
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // Above mask because use the middleware (pre) the monogoose bypass some advanced function like findByIdAndUpdate.

        const user = await User.findById(req.params.id);
        updates.forEach((item) => {
            user[item] = req.body[item];
        });
        await user.save();

        if (!user) {
            res.status(404).send();
        }
        res.send(user);
    } catch (e) {
        // validation issue or DB issue
        res.status(400).send();
    }   
});

router.delete('/users/:id', async (req, res) => {
    try {
        const deleteUser = await User.findByIdAndRemove(req.params.id);
        if (!deleteUser) {
            res.status(404).send('Did not find the user!');
        }
        res.send(deleteUser);
    } catch (e) {
        res.status(500).send();
    }
});

export default router;