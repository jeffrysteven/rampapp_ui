import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import InputAdornment from '@material-ui/core/InputAdornment';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { CircularProgress } from '@material-ui/core';

import { getVSCodeExtensions } from '../../helpers/getVSCodeExt';
import { ComponentListItem } from './ComponentListItem/ComponentListItem';

import styles from './ComponentCard.css';

const debounce = (fn, wait) => {
  let timer;

  return function (...args) {
    const later = () => {
      clearTimeout(timer);
      fn(...args);
    };
    clearTimeout(timer);
    timer = setTimeout(later, wait);
  };
};

export const ComponentCard = ({
  items,
  title,
  className,
  getSelectedItems,
}) => {
  const listClassName = classnames(styles.componentCard);
  const [vsCodeExtensions, setVsCodeExtensions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getExtensions = debounce(async (query) => {
    const results = await getVSCodeExtensions(query);
    const {
      results: [{ extensions }],
    } = results;
    setVsCodeExtensions(extensions);
    setIsLoading(false);
  }, 300);

  const onSearch = ({ target: { value } }) => {
    if (!isLoading && value) {
      setIsLoading(true);
    }
    if (value) {
      getExtensions(value);
    }
  };

  return (
    <Card className={className} variant="outlined">
      <List className={listClassName}>
        <ListSubheader className={styles.subHeader}>
          <h3 className={styles.title}>{title}</h3>
          <Autocomplete
            id="card-autocomplete"
            multiple
            loading={isLoading}
            onChange={(event, newValues) => {
              const valuesToAdd = newValues.filter(
                (value) =>
                  !items.some((selectedExt) => value.id === selectedExt.id),
              );

              if (valuesToAdd.length) {
                getSelectedItems((selectedExt) =>
                  selectedExt.concat(valuesToAdd),
                );
              }
            }}
            onInputChange={onSearch}
            options={vsCodeExtensions.map((option) => {
              const img = option?.versions[0]?.files.find(
                (file) =>
                  file.assetType ===
                  'Microsoft.VisualStudio.Services.Icons.Default',
              );

              return {
                id: option.extensionId,
                title: option.displayName,
                img: img?.source || '',
                description: option.shortDescription,
              };
            })}
            getOptionLabel={(option) => option.title}
            renderOption={(option) => {
              return (
                <ComponentListItem
                  item={option}
                  key={`item-${option.extensionId}`}
                  component="div"
                />
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                className={styles.search}
                placeholder="Search"
                fullWidth
                size="small"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {isLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />
        </ListSubheader>
        {items.map((item) => (
          <ComponentListItem item={item} key={`item-${item.id}`} />
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
  title: PropTypes.string,
  className: PropTypes.string,
  getSelectedItems: PropTypes.func,
};
