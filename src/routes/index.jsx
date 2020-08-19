import React from "react";
import { Switch, Route } from "react-router-dom";
import { Home } from "../pages";

export const Routes = () => {
  return (
    <Switch>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  );
};
