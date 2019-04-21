const fs = require('fs');
const path = require('path');
const express = require('express');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');
const db = require('./db');
const BooksRepository = require('./books-repository');
const resolvers = require('./resolvers');

const app = express();

const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

async function context({req}) {
  const client = await db.connect();
  const booksColl = client.db('books').collection('books');
  const booksRepository = new BooksRepository(booksColl);
  return {
    booksRepository
  };
}

const isDev = process.env.NODE_ENV === 'development'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  introspection: true,
  playground: isDev,
  debug: isDev,
});

server.applyMiddleware({ app, path: '/gql' });

module.exports = app;
