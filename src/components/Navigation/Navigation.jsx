import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navigation.css';

export const Navigation = () => {
  return (
    <nav>
      <ul className={styles.menu}>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>
    </nav>
  );
};
