import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import BooksService from '../lib/BooksService';
import BookEntry from './BookEntry';
import BookModal from './BookModal';

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

const MODAL_OFF = 1;
const MODAL_ADDING = 2;
const MODAL_EDITING = 3;

class BooksContainer extends Component {
  state = {
    books: [],
    modalState: MODAL_OFF,
    bookToEdit: {},
  };

  async componentWillMount() {
    await this.refreshBooks();
  }

  // Books API interaction

  refreshBooks = async () => {
    const books = await BooksService.getBooks();
    this.setState({ books });
  };

  // Modal handlers

  openAddBookModal = () => {
    this.setState({ modalState: MODAL_ADDING });
  };

  openEditBookModal = () => {
    this.setState({ modalState: MODAL_EDITING });
  };

  closeBookModal = () => {
    console.log('closeBookModal');
    this.setState({
      modalState: MODAL_OFF,
      bookToEdit: {
        title: '',
        author: '',
        url: '',
        id: null,
      },
    });
  };

  onBookModalInputChange = (field, event) => {
    const { bookToEdit } = this.state;
    this.setState({
      bookToEdit: {
        ...bookToEdit,
        [field]: event.target.value,
      },
    });
  };

  onBookModalSubmit = async event => {
    const { modalState, bookToEdit } = this.state;
    const { title, author, url, id } = bookToEdit;
    if (modalState === MODAL_ADDING) {
      await BooksService.addBook({ title, author, url });
    } else if (modalState === MODAL_EDITING) {
      await BooksService.updateBook({ id, title, author, url });
    } else {
      console.error('modalState value invalid');
    }
    this.closeBookModal();
    await this.refreshBooks();
  };

  // This component's handlers

  handleBookEditClick = bookDetails => {
    this.setState({ bookToEdit: { ...bookDetails } });
    this.openEditBookModal();
  };

  handleFabClick = () => {
    this.openAddBookModal();
  };

  render() {
    const { books, modalState, bookToEdit } = this.state;
    // const { title = '', author = '', url = '', id = null } = bookToEdit || {};
    const { classes } = this.props;
    const ids = books.map(book => book.id);
    console.log('render', { ids });
    const bookEntries = books.map(bookDetails => {
      // const key = `${bookDetails.title}-${bookDetails.author}`;
      const key = bookDetails.id;
      return (
        <BookEntry
          {...bookDetails}
          key={key}
          onEdit={() => this.handleBookEditClick(bookDetails)}
        />
      );
    });

    const modalIsOpen = modalState !== MODAL_OFF;

    const modal = (
      <BookModal
        open={modalIsOpen}
        classes={classes}
        onTitleChange={event => this.onBookModalInputChange('title', event)}
        onAuthorChange={event => this.onBookModalInputChange('author', event)}
        onURLChange={event => this.onBookModalInputChange('url', event)}
        onClose={this.closeBookModal}
        onCancel={this.closeBookModal}
        onSubmit={this.onBookModalSubmit}
        title={bookToEdit.title || ''}
        author={bookToEdit.author || ''}
        url={bookToEdit.url || ''}
        id={bookToEdit.id || ''}
      />
    );

    return (
      <Grid container spacing={8}>
        <Grid item xs={12} className={classes.heading}>
          <Typography variant="h6">Books</Typography>
        </Grid>
        {modal}
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
