const log = console;

const getBooks = async (parent, args, context, info) => {
  const { title, author } = args;
  const { booksRepository, user } = context;
  const { email } = user;
  const res = await booksRepository.getBooks({ userId: email, title, author });
  log.debug('retrieved books', res);
  return res;
}

const addBook = async (parent, args, context) => {
  const {title, author, url} = args;
  const { booksRepository, user } = context;
  const { email } = user;
  console.log('addBook', title, author, url);
  const res = await booksRepository.addBook({ userId: email, title, author, url });
  log.info('added book', res);
  return true;
}

const deleteBook = (parent, {title}, context) => {
  console.log(`Deleting book "${title}"`);
  const { booksRepository, user } = context;
  const { email } = user;
  const res = await booksRepository.deleteBook({ userId: email, title });
  log.info('deleted book', res);
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
