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

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${AUTH_DOMAIN}/.well-known/jwks.json`
  }),

  audience: AUTH_AUDIENCE,
  issuer: `https://${AUTH_DOMAIN}/`,
  algorithms: [ 'RS256' ]
});

app.use(checkJwt);

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
