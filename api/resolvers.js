const getBooks = (parent, args, context, info) => {
  const { title, author } = args;
  const { booksRepository } = context;
  return booksRepository.getBooks({ title, author });
}

const addBook = async (parent, args, context) => {
  const {title, author, url} = args;
  const { booksRepository } = context;
  console.log('addBook', title, author, url);
  const res = await booksRepository.addBook({ title, author, url });
  console.log('added book', res);
  return true;
}

const deleteBook = (parent, {title}, context) => {
  console.log(`Deleting book "${title}"`);
  return true;
}

module.exports = {
  Query: {
    hello: () => 'Hello, world!',
    books: getBooks,
  },
  Mutation: {
    addBook,
    deleteBook,
  }
};
