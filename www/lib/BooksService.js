import fetch from 'isomorphic-unfetch';
import auth from './auth';

const { log } = console;

const getBooksGQL = `
  {
    books {
      id, title, author, url
    }
  }
`;

const addBookGQL = `
  mutation addBook($book: AddBookInput!) {
    addBook(book: $book)
  }
`;

const updateBookGQL = `
  mutation updateBook($book: UpdateBookInput!) {
    updateBook(book: $book)
  }
`;

export default class BookService {
  static async callAPI(body) {
    const idToken = auth.getIDToken();
    log('calling api', body);
    const res = await fetch('/api/gql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body,
    });
    const respBody = await res.json();
    log('api call respBody', respBody);
    const { data } = respBody;
    return data;
  }

  static async getBooks() {
    const body = JSON.stringify({ query: getBooksGQL });
    const { books } = await this.callAPI(body);
    log('retreived books from api', { books });
    return books;
  }

  static async addBook({ title, author, url }) {
    const body = JSON.stringify({ query: addBookGQL, variables: { book: { title, author, url } } });
    const data = await this.callAPI(body);
    log('addBook resp data', data);
    return data;
  }

  // updateBook = async ({ id, title, author, url }) => {
  static async updateBook({ id, title, author, url }) {
    const body = JSON.stringify({
      query: updateBookGQL,
      variables: { book: { id, title, author, url } },
    });
    const data = await this.callAPI(body);
    log('updateBook resp data', data);
    return data;
  }
}
