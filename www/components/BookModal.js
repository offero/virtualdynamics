import React from 'react';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';

class BookModal extends React.Component {
  render() {
    const {
      classes,
      open,
      onClose,
      onCancel,
      onSubmit,
      onTitleChange,
      onAuthorChange,
      onURLChange,
      submitText = 'Save',
      title = '',
      author = '',
      url = '',
      id = null,
      // onTitleChange,
      // onAuthorChange,
      // onURLChange,
    } = this.props;
    return (
      <Modal open={open} onClose={onClose}>
        <Grid container direction="row" alignItems="center" justify="center">
          <Grid item xs={10} className={classes.paper}>
            <Grid container>
              <form
                onSubmit={e => {
                  onSubmit(e);
                  e.preventDefault();
                }}
              >
                <Grid item>
                  <Typography variant="subtitle1">Enter Book Details</Typography>
                </Grid>
                <Grid item>
                  <InputLabel htmlFor="new-book-title">Title</InputLabel>
                  <Input
                    className={classes.input}
                    autoFocus
                    value={title}
                    id="new-book-title"
                    onChange={onTitleChange}
                  />
                </Grid>
                <Grid item>
                  <InputLabel htmlFor="new-book-author">Author</InputLabel>
                  <Input
                    className={classes.input}
                    value={author}
                    id="new-book-author"
                    onChange={onAuthorChange}
                  />
                </Grid>
                <Grid item>
                  <InputLabel htmlFor="new-book-url">URL</InputLabel>
                  <Input
                    className={classes.input}
                    value={url}
                    id="new-book-url"
                    onChange={onURLChange}
                  />
                </Grid>
                <Grid item>
                  <Button color="primary" type="submit">
                    {submitText}
                  </Button>
                  <Button color="secondary" onClick={onCancel}>
                    Cancel
                  </Button>
                </Grid>
              </form>
            </Grid>
          </Grid>
        </Grid>
      </Modal>
    );
  }
}

export default BookModal;
