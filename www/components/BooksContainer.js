import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import { Fab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import fetch from 'isomorphic-unfetch';

import BookEntry from './BookEntry';

const styles = theme => ({
  heading: {
    margin: theme.spacing.unit,
    textAlign: 'center',
  },
  fab: {
    margin: theme.spacing.unit,
  },
});

const getBooksGQL = `
  {
    books {
      title, author, url
    }
  }
`;

class BooksContainer extends Component {
  state = {
    books: [],
  };

  async componentWillMount() {
    const body = JSON.stringify({ query: getBooksGQL });
    const res = await fetch('/api/gql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    const books = await res.json();
    this.setState({
      books,
    });
  }

  render() {
    const { books } = this.state;
    const { classes } = this.props;
    return (
      <Grid container spacing={8}>
        <Grid item xs={12} className={classes.heading}>
          <Typography variant="h6">Books</Typography>
        </Grid>
        <Grid item xs={12}>
          <List>{books.map(BookEntry)}</List>
        </Grid>
        <Grid item xs={12}>
          <Grid container justify="flex-end">
            <Grid item>
              <Fab className={classes.fab} color="primary">
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(BooksContainer);
