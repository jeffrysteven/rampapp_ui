import React from "react";
import { Switch, Route } from "react-router-dom";
import { About, Home } from "../pages";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/home">
        <Home />
      </Route>
      <Route path="/about">
        <About />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};
