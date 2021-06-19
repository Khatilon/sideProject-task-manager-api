import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;

const connectionURL = 'mongodb://127.0.0.1:27017';
const dataBaseName = 'testDB';

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        console.log("Unable to connent the mongoDB");
    }
    console.log("DB connected");

    const db = client.db(dataBaseName);
    db.collection('rayTestDB').insertOne({
        name: "ray",
        age: 88
    }, (error, result) => {
        if (error) {
            console.log("Error! You can not insert the data!");
        }
        console.log("Insert a data : ", result.ops);
    })

    client.close();
})