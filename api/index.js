const fs = require('fs');
const path = require('path');
const express = require('express');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./db');
const BooksRepository = require('./books-repository');
const resolvers = require('./resolvers');

const app = express();

const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

const AUTH_DOMAIN = process.env.AUTH_DOMAIN;
const AUTH_AUDIENCE = process.env.AUTH_AUDIENCE;

console.info('AUTH_DOMAIN', AUTH_DOMAIN);
console.info('AUTH_AUDIENCE', AUTH_AUDIENCE);

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${AUTH_DOMAIN}/.well-known/jwks.json`
  }),
  // audience: AUTH_AUDIENCE,
  issuer: `https://${AUTH_DOMAIN}/`,
  algorithms: [ 'RS256' ]
});

app.use(checkJwt);

class UnverifiedEmail extends Error {
  constructor(email, sub) {
    super(`Unverified e-mail: ${email} sub: ${sub}`);
    this.code = 'unverified_email'; // express-jwt style
    this.status = 401;
  }
}

function checkVerified(req, res, next) {
  const { user } = req;
  if (!user.email_verified) {
    log.warn('Unverified e-mail encountered', {user});
    return next(new UnverifiedEmail(user.email, user.sub));
  }
  return next();
}

app.use(checkVerified);

function handleErrors(err, req, res, next) {
  const status = err.status || 500;
  const { message, code } = err;
  log.warn('Error encountered', {status, message, code});
  res.status(status);
  res.send({ error: message });
}

app.use(handleErrors);

async function context({ req }) {
  const client = await db.connect();
  const booksColl = client.db('books').collection('books');
  const booksRepository = new BooksRepository(booksColl);
  const { user } = req;
  return {
    booksRepository,
    user,
  };
}

const isDev = process.env.NODE_ENV === 'development'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: isDev,
  playground: isDev,
  debug: isDev,
  // cors: true
  // tracing
  // cacheControl
});

server.applyMiddleware({ app, path: '/gql' });

module.exports = app;
