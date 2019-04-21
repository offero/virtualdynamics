const path = require('path');
const api = require('./index');
const dotenv = require('dotenv');

// const dotenvPath = path.resolve(process.cwd(), '../.env');
// dotenv.config({path: dotenvPath, debug: true})
dotenv.config();

const PORT = parseInt(process.env.PORT, 10) || 3002;

api.on('error', (error) => {
  console.log(error);
});

api.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`> development server listening on port ${PORT}!`)
  }
});

    // process.on('SIGINT', close);
    // process.on('SIGTERM', close);
