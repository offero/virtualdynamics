const { MongoClient } = require('mongodb');

const log = console; // TODO: replace console
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
    const url = process.env.MONGO_URL;
    log.info('connecting to db', url);
    const options = { useNewUrlParser: true };
    client = await MongoClient.connect(url, options);
    log.info('connnected to db');
  }
  return client;
}

module.exports = {
  connect,
  close,
};
