import React from 'react';
import { Redirect, Route } from 'react-router';

const GuardedRoute = ({ component: Component, authenticated, ...rest }) => {
  <Route
    {...rest}
    render={(props) => (authenticated === true ? <Component {...props} /> : <Redirect to="/" />)}
  />;
};
