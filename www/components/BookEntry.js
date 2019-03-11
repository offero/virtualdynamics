import React, { Component, Fragment } from 'react';
// import Link from 'next/link';
import PropTypes from 'prop-types';

// import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
// import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import EditIcon from '@material-ui/icons/Edit';
import ListItemText from '@material-ui/core/ListItemText';
// import Grid from '@material-ui/core/Grid';
import { Avatar } from '@material-ui/core';
// import green from '@material-ui/core/colors/green';

const BookEntry = (props) => {
  const { title, author, url, key } = props;
  return (
    <ListItem button component="a" href={url} target="_blank" rel="noreferrer noopener" key={key}>
      <ListItemAvatar>
        <Avatar>
          <BookmarkIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={author}
      />
      <ListItemSecondaryAction>
        <IconButton aria-label="Edit">
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

BookEntry.propTypes = {
  title: PropTypes.string.isRequired,
  author: PropTypes.string,
  url: PropTypes.string,
};

BookEntry.defaultProps = {
  author: '',
  url: '',
};

export default BookEntry;
