import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import styles from './Home.css';

export const Home = () => {
  const [clicks, setClicks] = useState(0);

  const clickHandler = () => {
    setClicks(clicks + 1);
  };

  return (
    <div className={styles.home}>
      <label className="block">You clicked me {clicks} times</label>c
      <hr/>
      <Button onClick={clickHandler}>Click me</Button>
    </div>
  );
};
