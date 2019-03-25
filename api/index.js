const express = require('express');
const jwt = require('express-jwt');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const { ApolloServer, gql } = require('apollo-server-express');

const app = express();

const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8");

const BOOKS = [
  { title: 'Title 1', author: 'Author 1', url: 'https://somewhere.com'},
  { title: 'Title 2', author: 'Author 2', url: 'https://somewhere.com'},
  { title: 'Title 3', author: 'Author 3', url: 'https://somewhere.com'},
];

const getBooks = (parent, args, context, info) => {
  return BOOKS;
}

const addBook = (parent, {title, author, url}, context) => {
  console.log('addBook', title, author, url);
  if (!title) {
    return false;
  }
  BOOKS.push({ title, author, url });
  return true;
}

const deleteBook = (parent, {title}, context) => {
  const i = BOOKS.findIndex((book) => book.title == title);
  if (i < 0) {
    console.log("Could not find book", i, title);
    return '';
  }
  console.log(`Deleting book "${title}"`);
  delete BOOKS[i];
  return title;
}

const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    books: getBooks,
  },
  Mutation: {
    addBook,
    deleteBook,
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

server.applyMiddleware({ app, path: '/gql' });

module.exports = app;
