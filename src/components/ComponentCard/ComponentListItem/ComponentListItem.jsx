import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import MoreVertIcon from '@material-ui/icons/MoreVert';

import styles from './ComponentListItem.css';
const useStyles = makeStyles(() => ({
  container: {
    width: '100%',
  },
}));

export const ComponentListItem = ({ item, onClick, component = 'li' }) => {
  const classes = useStyles();

  return (
    <ListItem ContainerComponent={component} classes={classes}>
      <ListItemAvatar>
        <Avatar src={item.img} />
      </ListItemAvatar>
      <ListItemText primary={item.title} secondary={item.description} />
      <ListItemSecondaryAction className={styles.moreIcon}>
        <IconButton edge="end" aria-label="delete" onClick={onClick}>
          <MoreVertIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

ComponentListItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    img: PropTypes.String,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
  }).isRequired,
  component: PropTypes.string,
  onClick: PropTypes.func,
};
