class BooksRepository {
  /* db: Instance of a books mongo database
  */
  constructor(coll) {
    this.coll = coll;
  }

  /* Returns a promise that resolves with the book documents
  */
  getBooks({userEmail, title, author}) {
    const query = { userEmail };
    if (title) query.title = title;
    if (author) query.author = author;
    const cur = this.coll.find(query);
    // http://mongodb.github.io/node-mongodb-native/3.2/api/Cursor.html#toArray
    return cur.toArray()
  }

  /* Returns a promise that resolves when the book document is inserted
  */
  addBook({userEmail, userId, title, author, url})  {
    return this.coll.insertOne({userEmail, userId, title, author, url});
  }

  deleteBook({userEmail, title}) {
    return this.coll.remove({userEmail, title});
  }
}

module.exports = BooksRepository;
