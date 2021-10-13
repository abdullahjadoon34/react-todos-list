const { MongoClient } = require('mongodb');

const database = module.exports;
//'mongodb://root:1234@database/
database.connect = async function connect() {
  database.client = await MongoClient.connect('mongodb://localhost:27017/database', { useUnifiedTopology: true });
};
