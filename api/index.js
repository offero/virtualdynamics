const express = require('express');
const jwt = require('express-jwt');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const typeDefs = gql`
  type Query {
    hello: String
    books: [Book]
  }
  type Book {
    title: String
    author: Author

  }
  type Author {
    name: String
    books: [Book]
  }
`;

const getBooks = (args) => {
  return [
    { title: 'My Book Title', author: { name: 'Mr. Someone' } }
  ]
}

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    books: getBooks
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
server.applyMiddleware({ app, path: '/gql' });

module.exports = app;
