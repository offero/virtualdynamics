import React, { Component } from 'react';
import AddIcon from '@material-ui/icons/Add';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import { Fab } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

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

const bookEntriesFromSomewhere = [
  { title: 'Title 1', author: 'Author 1', url: 'https://somewhere.com', key: 0 },
  { title: 'Title 2', author: 'Author 2', url: 'https://somewhere.com', key: 1 },
  { title: 'Title 3', author: 'Author 3', url: 'https://somewhere.com', key: 2 },
];

class BooksContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  componentWillMount() {
    this.setState({
      books: bookEntriesFromSomewhere,
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
