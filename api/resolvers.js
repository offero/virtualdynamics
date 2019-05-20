const log = console;

// graphql function signature: parent, args, context, info

const getBooks = async (parent, args, context, info) => {
  const { booksRepository, user } = context;
  const { title, author } = args;
  const { email: userEmail, sub: userId } = user;
  const query = {userEmail, title, author};
  const books = await booksRepository.getBooks(query);
  log.info('retrieved books', {nbooks: books.length, query});
  return books;
}

const addBook = async (parent, args, context) => {
  const { booksRepository, user } = context;
  const {title, author, url} = args;
  const { email: userEmail, sub: userId } = user;
  log.info('addBook', title, author, url);
  const bookDoc = { userEmail, userId, title, author, url };
  const res = await booksRepository.addBook(bookDoc);
  log.info('added book', bookDoc);
  return true;
}

const deleteBook = async (parent, {title}, context) => {
  log.debug(`Deleting book "${title}"`);
  const { booksRepository, user } = context;
  const { email: userEmail, sub: userId } = user;
  const query = {userEmail, title};
  const res = await booksRepository.deleteBook(query);
  log.info('deleted book', query);
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
