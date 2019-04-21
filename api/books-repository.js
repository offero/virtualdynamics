class BooksRepository {
  /* db: Instance of a books mongo database
  */
  constructor(coll) {
    this.coll = coll;
  }

  /* Returns a promise that resolves with the book documents
  */
  getBooks({title, author}) {
    const query = {};
    if (title) query.title = title;
    if (author) query.author = author;
    const cur = this.coll.find(query);
    // http://mongodb.github.io/node-mongodb-native/3.2/api/Cursor.html#toArray
    return cur.toArray()
  }

  /* Returns a promise that resolves when the book document is inserted
  */
  addBook({title, author, url})  {
    return this.coll.insertOne({title, author, url});
  }

  deleteBook({title}) {
    return this.coll.remove({title});
  }
}

module.exports = BooksRepository;
