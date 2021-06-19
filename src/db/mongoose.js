import mongoose from 'mongoose';
import validator from 'validator';

// mongoose 是一個ODM
// connect url is  url + databaseName
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    // let the data has index
    useCreateIndex: true
});