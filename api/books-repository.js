const { ObjectID } = require('mongodb');

class BooksRepository {
  /* db: Instance of a books mongo database
   */
  constructor(coll) {
    this.coll = coll;
  }

  /* Returns a promise that resolves with the book documents
   */
  async getBooks({ userEmail, title, author }) {
    const query = { userEmail };
    if (title) query.title = title;
    if (author) query.author = author;
    const cur = this.coll.find(query);
    // http://mongodb.github.io/node-mongodb-native/3.2/api/Cursor.html#toArray
    const books = await cur.toArray();
    const booksWithIDs = books.map(book => ({
      ...book,
      id: book._id.toString(),
    }));
    return booksWithIDs;
  }

  /* Returns a promise that resolves when the book document is inserted
   */
  addBook({ userEmail, userId, title, author, url }) {
    return this.coll.insertOne({ userEmail, userId, title, author, url });
  }

  deleteBook({ userEmail, id }) {
    const _id = ObjectID(id);
    return this.coll.remove({ userEmail, _id });
  }

  updateBook({ userEmail, id, title, author, url }) {
    const _id = ObjectID(id);
    return this.coll.update({ userEmail, _id }, { $set: { title, author, url } });
  }
}

module.exports = BooksRepository;
