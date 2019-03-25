// start this server on 3000
// start next app on 3001
// navigate to localhost:3000
const express = require('express');
const PORT = parseInt(process.env.PORT, 10) || 3000;
const proxy = require('http-proxy-middleware');
const server = express();

server.use('/api', proxy({
  target: 'http://localhost:3002',
  pathRewrite: {
    '^/api': '/',
  },
}));

server.use('/', proxy({
  target: 'http://localhost:3001'
}));

server.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`> development proxy server listening on port ${PORT}!`)
  }
});
