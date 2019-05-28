import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';
import fetch from 'isomorphic-unfetch';

import auth from '../lib/auth';
import BookEntry from './BookEntry';

// TODO: Extract modal into component

const styles = theme => {
  console.log('theme', theme);
  const { unit } = theme.spacing;
  return {
    heading: {
      margin: theme.spacing.unit,
      textAlign: 'center',
    },
    fab: {
      margin: theme.spacing.unit,
    },
    paper: {
      margin: unit,
      backgroundColor: theme.palette.background.default,
      boxShadow: theme.shadows[5],
      outline: 'none',
      padding: unit,
    },
    input: {
      margin: unit,
    },
  };
};

const getBooksGQL = `
  {
    books {
      title, author, url
    }
  }
`;

const addBookGQL = `
  mutation addBook($book: BookInput!) {
    addBook(book: $book)
  }
`;

class BooksContainer extends Component {
  state = {
    books: [],
    addingBook: false,
    authorInput: '',
    titleInput: '',
    urlInput: '',
  };

  async componentWillMount() {
    await this.refreshBooks();
  }

  refreshBooks = async () => {
    const books = await this.getBooks();
    this.setState({ books });
  };

  callAPI = async body => {
    const idToken = auth.getIDToken();
    console.log('calling api', body);
    const res = await fetch('/api/gql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`,
      },
      body,
    });
    const respBody = await res.json();
    console.log('api call respBody', respBody);
    const { data } = respBody;
    return data;
  };

  getBooks = async () => {
    const body = JSON.stringify({ query: getBooksGQL });
    const { books } = await this.callAPI(body);
    console.log('retreived books from api', { books });
    return books;
  };

  addBook = async (title, author, url) => {
    const body = JSON.stringify({ query: addBookGQL, variables: { book: { title, author, url } } });
    const data = await this.callAPI(body);
    console.log('addBook resp data', data);
    return data;
  };

  openAddBookModal = () => {
    this.setState({ addingBook: true });
  };

  closeAddBookModal = () => {
    this.setState({ addingBook: false });
  };

  handleCancelAddBookClick = () => {
    console.log('handleCancelAddBookClick');
    this.closeAddBookModal();
  };

  handleSubmitAddBook = async event => {
    event.preventDefault();
    console.log('handleSubmitAddBook');
    console.log('state');
    console.log(this.state);
    const { authorInput, titleInput, urlInput } = this.state;
    await this.addBook(titleInput, authorInput, urlInput);
    this.setState({
      titleInput: '',
      authorInput: '',
      urlInput: '',
    });
    this.closeAddBookModal();
    await this.refreshBooks();
  };

  handleAddBookModalClose = () => {
    console.log('handleAddBookModalClose');
    this.closeAddBookModal();
  };

  handleFabClick = () => {
    this.openAddBookModal();
  };

  onTitleInputChange = event => {
    this.setState({
      titleInput: event.target.value,
    });
  };

  onURLInputChange = event => {
    this.setState({
      urlInput: event.target.value,
    });
  };

  onAuthorInputChange = event => {
    this.setState({
      authorInput: event.target.value,
    });
  };

  render() {
    const { books, addingBook, titleInput, authorInput, urlInput } = this.state;
    const { classes } = this.props;
    const bookEntries = books.map(BookEntry);
    return (
      <Grid container spacing={8}>
        <Grid item xs={12} className={classes.heading}>
          <Typography variant="h6">Books</Typography>
        </Grid>
        <Modal open={addingBook} onClose={this.handleAddBookModalClose}>
          <Grid container direction="row" alignItems="center" justify="center">
            <Grid item xs={10} className={classes.paper}>
              <Grid container>
                <form onSubmit={this.handleSubmitAddBook}>
                  <Grid item>
                    <Typography variant="subtitle1">Enter Book Details</Typography>
                  </Grid>
                  <Grid item>
                    <InputLabel htmlFor="new-book-title">Title</InputLabel>
                    <Input
                      className={classes.input}
                      autoFocus
                      value={titleInput}
                      id="new-book-title"
                      onChange={this.onTitleInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <InputLabel htmlFor="new-book-author">Author</InputLabel>
                    <Input
                      className={classes.input}
                      value={authorInput}
                      id="new-book-author"
                      onChange={this.onAuthorInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <InputLabel htmlFor="new-book-url">URL</InputLabel>
                    <Input
                      className={classes.input}
                      value={urlInput}
                      id="new-book-url"
                      onChange={this.onURLInputChange}
                    />
                  </Grid>
                  <Grid item>
                    <Button color="primary" type="submit">
                      Add Book
                    </Button>
                    <Button color="secondary" onClick={this.handleCancelAddBookClick}>
                      Cancel
                    </Button>
                  </Grid>
                </form>
              </Grid>
            </Grid>
          </Grid>
        </Modal>
        <Grid item xs={12}>
          <List>{bookEntries}</List>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="flex-end">
            <Grid item>
              <Fab className={classes.fab} color="primary" onClick={this.handleFabClick}>
                <AddIcon aria-label="Add Book" />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BooksContainer);
