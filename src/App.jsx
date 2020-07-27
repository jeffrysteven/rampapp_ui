import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes } from './routes';
import { Navigation } from './components/Navigation';
import styles from './App.css';

const App = () => (
  <div className={styles.main}>
    <Router>
      <Navigation />
      <section>
        <Routes />
      </section>
    </Router>
  </div>
);

export default App;
