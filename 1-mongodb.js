// CRUD create read update delete

// for normal sql, table --> row/record -->  column
// for mongoDB, collection --> document --> field
import mongodb from 'mongodb';

const { MongoClient, ObjectID } = mongodb;
const connectionURL = 'mongodb://127.0.0.1:27017';
const dataBaseName = 'task-manager';

// const id = new ObjectID();

// console.log(id);
// console.log(id.getTimestamp());

MongoClient.connect(connectionURL, { useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log('Unable to connent to database!');
    }

    console.log('Connected correctly!');
    // create a new database 
    const db = client.db(dataBaseName);

    // db.collection('users').deleteMany({
    //     age: 26
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection('tasks').deleteOne({
    //     description: 'first blood'
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    client.close();
});