const api = require('./index');

const PORT = parseInt(process.env.PORT, 10) || 3002;

api.on('error', (error) => {
  console.log(error);
})

api.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`> development proxy server listening on port ${PORT}!`)
  }
});
