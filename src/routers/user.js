import express from 'express';
import User from '../model/user.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import sharp from 'sharp';

// add router
const router = express.Router();
const fileUpdload = multer({
    // 使用此會自己建構初avatar的資料夾
    // dest: 'docfiles', //由於現在不是要創建資料夾了, 要改存db 所以不需要這行, 這樣會把資料pass到後方的middleware
    limits: {
        // 1mb
        fileSize: 1000000
    },
    // cb 
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(doc|docx)$/)) {
            return cb(new Error('Please upload the word document!'));
        }

        cb(undefined, true);
        // cb(new Error('File must be pdf'));
        // cb(undefined, true);
        // cb(undefined, false);
    }
});

const imgUpdload = multer({
    // dest: 'avatars', //由於現在不是要創建資料夾了, 要改存db 所以不需要這行, 這樣會把資料pass到後方的middleware
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload the jpg or jpeg file!'));
        }
        cb(undefined, true);
    }

})

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

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((item) => allowedUpdates.includes(item));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'});
    }
    
    try {
        updates.forEach((item) => {
            req.user[item] = req.body[item];
        });
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        // validation issue or DB issue
        res.status(400).send();
    }   
});

// 切記delete掉user後其對應的task也要能跟著刪掉, 此時有兩種方式能實作
// 一種是直接加在user remove的code下面, 但還有另外一種方法是加在middleware (Good habit)
router.delete('/users/me', auth, async (req, res) => {
    try {
        // 注意 此時的req.user已經是instance了 (回頭去看auth的code)
        await req.user.remove();
        res.send(`You have delete the user: ${req.user}`);
    } catch (e) {
        res.status(500).send();
    }
});

// 用來解說imgUpdload的error行為該怎麼處理
const errorMiddleware = (req, res, next) => {
    throw new Error('From my middleware');
};

// imgUpdload.single('avatar')內的avatar是取決於postman打進去的參數, 並將圖片存在自動產生的avatar資料夾
// imgUpload雖然會將圖片產生在avatar資料夾內, 但實際上部署後 不太可能去撈存在資料夾的圖片, 因為從新push code到Heroku時會刪掉原本avatar內的照片
// 所以真正儲存圖片的地方不會是avatar資料夾, 所以實際上應該是要將檔案存在DB裡面
// 所以我們回頭將imgUpload的dest那行註記起來, 這樣就不會產生資料夾, 並且將資料儲存在req.file.buffer內
// 並且可以用npm sharp的method來達到轉換檔案及resize檔案大小的目第
router.post('/users/me/avatar', auth, imgUpdload.single('avatar'), async (req, res) => {
    // console.log(req.file);
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send('You have success store the avatar!');

}, (error, req, res, next) => {
    // if 上面的imgUpdload middleware掛掉會走到這裡
    // 原本上方的位置是用errorMiddleware來做測試用, 代表當今天imgUpdload掛掉時 行為會跟errorMiddleware一樣
    res.status(400).send({ error: error.message });
});

router.delete('/users/me/avatar', auth, async (req, res) => {
    try {
        req.user.avatar = undefined;
        await req.user.save();
        res.send('You have success remove the avatar!');
    } catch(e) {
        res.status(400).send();
    }
});

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        // 要告訴requester我們要什麼資料, 所以透過以下此方法才set header參數
        // 常見格式如下
        // 一般表單欄位:  application/x-www-form-urlencoded 
        // 檔案上傳: multipart/form-data; boundary=--xxx 
        // JSON資料: application/json 
        // 純文字: text/plain 
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
        // 可以直接複製api的url到網頁上看照片
    } catch (e) {
        res.status(404).send();
    }
})

export default router;