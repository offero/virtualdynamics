class BooksRepository {
  /* db: Instance of a books mongo database
  */
  constructor(coll) {
    this.coll = coll;
  }

  /* Returns a promise that resolves with the book documents
  */
  getBooks({userId, title, author}) {
    const query = { userId };
    if (title) query.title = title;
    if (author) query.author = author;
    const cur = this.coll.find(query);
    // http://mongodb.github.io/node-mongodb-native/3.2/api/Cursor.html#toArray
    return cur.toArray()
  }

  /* Returns a promise that resolves when the book document is inserted
  */
  addBook({userId, title, author, url})  {
    return this.coll.insertOne({userId, title, author, url});
  }

  deleteBook({userId, title}) {
    return this.coll.remove({userId, title});
  }
}

module.exports = BooksRepository;
