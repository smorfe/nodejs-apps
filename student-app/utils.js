const MongoClient = require('mongodb').MongoClient;

var _db = null;

const init = (callback) => {
    MongoClient.connect('mongodb://localhost:27017/test', {useNewUrlParser: true }, (err, client) => {
        if(err) {
            return console.log('Unable to connect to DB');
        }

        _db = client.db('test');

        console.log('Successfully connects to MongoDV server');
    })
}

const getDb = () => {
    return _db;
}

module.exports = {
    init,
    getDb
}