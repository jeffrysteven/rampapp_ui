import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Card from '@material-ui/core/Card';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import styles from './ComponentCard.css';

import classnames from 'classnames';

export const ComponentCard = ({ items, onSearchChange, searchValue, title }) => {
  const listClassName = classnames(styles.componentCard);
  const moreClicked = (position) => {
    console.log('Just clicked the icon', position);
  };

  return (
    <Card>
        <List className={listClassName}>
          <ListSubheader className={styles.subHeader}>
            <h3 className={styles.title}>{title}</h3>
            <TextField
              className={styles.search}
              placeholder="Search"
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              
            }}
            value={searchValue}
            onChange={onSearchChange}
            variant="outlined"
          />
          </ListSubheader>
          {items.map((item) => (
            <ListItem key={`item-${item.id}`}>
              <ListItemAvatar>
                <Avatar src={item.img} />
              </ListItemAvatar>
              <ListItemText primary={item.title} secondary={item.description} />
              <ListItemSecondaryAction className={styles.moreIcon}>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => moreClicked(position)}
                >
                  <MoreVertIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
    </Card>
  );
};

ComponentCard.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      img: PropTypes.String,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
    }),
  ).isRequired,
  onSearchChange: PropTypes.func,
  searchValue: PropTypes.string,
  title: PropTypes.string,
};
