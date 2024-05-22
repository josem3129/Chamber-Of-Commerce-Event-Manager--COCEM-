const dotenv = require('dotenv');
dotenv.config();
const { MongoClient } = require('mongodb');

let _db;

const initDb = (callback) => {
    if (_db) {
        return callback(null, _db);
    }
    MongoClient.connect(process.env.CONNECTION)
        .then((client) => {
            _db = client;
            callback(null, _db);
        })
        .catch((err) => {
            callback(err); // Pass the error to the callback function
        });
};

const getDb = () => {
    if (!_db) {
        throw Error('Db not initialized');
    }
    return _db;
};

module.exports = {
    initDb,
    getDb
};
