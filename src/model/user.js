import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Task from './task.js';
// setup the Schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                // use throw new Error can actually breakdown.
                throw new Error('Email is invalid');
                console.log('Email is invalid');
            }
        }
    },  
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0 ) {
                // use throw new Error can actually breakdown.
                throw new Error('Age must be a positive number');
                console.log('Age must be a positive number');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                // use throw new Error can actually breakdown.
                throw new Error('Password can not include the word of password');
                console.log('Password can not include the word of password');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        // can store the binary image data
        type: Buffer
    } 
}, {
    timestamps: true
});

// A virtual property is not actual data stored in the database.
// It's a relationship between two entities, in this case, between our user and our task.
userSchema.virtual('myTasks', {
    ref: 'Task',
    // foreign field is the name of the field on the other thing,
    // in this case, on the task that's going to create this relationship and we set that up
    // to be the owner of the local field is is where that local data is stored.
    // localField的_id是user自己的_id, foreignField的owner就是對應到task內的owner屬性
    localField: '_id',
    foreignField: 'owner'
});


// set the middleware  ( pre / post )

// 要使用this, 這邊的this 會指到userSchma內的東西,所以只能用一般的function, 不能用arrow function
// Hash the plain text password before saving
userSchema.pre('save', async function() {
    // console.log("this", this);
    // console.log("just before save");
    const user = this; //將this記錄下來

    // isModified will be true if the data is update or new for the params
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
});

// 當某一user被刪除時, 刪除其所有的tasks
userSchema.pre('remove', async function() {
    const user = this;
    console.log(user);
    await Task.deleteMany({ owner: user._id });
    console.log("delete user all tasks");
});

// 這邊因為不使用this 所以可以用arrow function
userSchema.statics.findByCredentials = async (email, password) => {
    console.log(email, password);
    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(isMatch);

    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};

// 要使用this, 這邊的this 會指到userSchma內的東西,所以只能用一般的function, 不能用arrow function
userSchema.methods.generateAuthToken = async function() {
    // console.log('generateAuthToken this', this);
    // 這邊註冊的東西有_id跟testWord兩個屬性, 之後透過jwt.verify找到的時候 會吐回這兩個屬性
    const token = jwt.sign({_id: this._id.toString(), testWord: "yoman"}, 'thisismynewcourse');
    // 將token塞入tokens
    this.tokens = this.tokens.concat({ token });
    // this指向user實例, 並儲存
    await this.save();

    return token;
};


// 因為要使用this 所以不使用arrow function
// 會用toJSON(monogoose的method)的原因是因為, 其實res.send(obj)時 obj會先做一次JSON.stringify(obj)的轉換才回傳
// ch12.112課程
userSchema.methods.toJSON = function () {
    // console.log('getPublicProfile', this);

    // 關於toObject是mongoose的方法 或許是這篇 https://stackoverflow.com/questions/31756673/what-is-the-difference-between-mongoose-toobject-and-tojson
    // 將instance 實例轉成obj?
    // toOject is going to give us just that raw profile data and then we could go ahead and return it.
    // 在這裡的this可以console.log出來看看
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar; // 因為avatar太長了 不需要顯示, 確定有存到DB即可

    return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;

