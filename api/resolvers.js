const log = console;

// graphql function signature: parent, args, context, info

const getBooks = async (parent, args, context) => {
  const { booksRepository, user } = context;
  const { email: userEmail } = user;
  const { title, author } = args;
  const doc = { userEmail, title, author };
  const books = await booksRepository.getBooks(doc);
  const ids = books.map(book => book.id);
  log.info('retrieved books', { userEmail, nbooks: books.length, ids, doc });
  return books;
};

const addBook = async (parent, args, context) => {
  const { booksRepository, user } = context;
  const { email: userEmail, sub: userId } = user;
  const { book } = args;
  log.info('addBook', { userEmail, book });
  const doc = { userEmail, userId, ...book };
  const res = await booksRepository.addBook(doc);
  const { acknowledged, insertedId } = res;
  const id = insertedId.valueOf();
  log.info('added book', { doc, res });
  return insertedId;
};

const updateBook = async (parent, args, context) => {
  const { booksRepository, user } = context;
  const { email: userEmail } = user;
  const { book } = args;
  log.info('updateBook', { userEmail, book });
  const doc = { userEmail, ...book };
  const res = await booksRepository.updateBook(doc);
  // res should only be 1; the number of docs updated
  log.info('updated book', { doc, res });
  return true;
};

const deleteBook = async (parent, args, context) => {
  const { booksRepository, user } = context;
  const { email: userEmail } = user;
  const { book } = args;
  const { id } = book;
  log.info('deleteBook', { userEmail, book });
  const doc = { userEmail, id };
  const res = await booksRepository.deleteBook(doc);
  log.info('deleted book', { doc, res });
  return true;
};

module.exports = {
  Query: {
    hello: () => 'Hello, world!',
    books: getBooks,
  },
  Mutation: {
    addBook,
    deleteBook,
    updateBook,
  },
};
