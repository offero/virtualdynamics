const { MongoClient } = require('mongodb');

let client;

async function close() {
  console.info('closing db connection');
  if (client.close) {
    await client.close();
  }
  client = null;
}

async function connect() {
  if (!client) {
    // XXX: create new
    const url = process.env.MONGO_URL;
    console.info('connecting to db', url);
    options = { useNewUrlParser: true }
    client = await MongoClient.connect(url, options);
    console.info('connnected to db');
  }
  return client;
}

module.exports = {
  connect,
  close
};
