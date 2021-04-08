import React from 'react';
import { Redirect, Route } from 'react-router';

const RouteGuard = ({ component: Component, authenticated, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => (authenticated === true ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};

export default RouteGuard;
