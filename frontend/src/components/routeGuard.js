import React, { useState } from 'react';
import { Redirect, Route } from 'react-router';
import { UserRepository } from '../api/userRepository';

const RouteGuard = ({ component: Component, authenticated, ...rest }) => {
  const userRepository = new UserRepository();

  const [loggedIn] = useState(userRepository.loggedIn());

  return (
    <Route
      {...rest}
      render={(props) => (loggedIn === true ? <Component {...props} /> : <Redirect to="/" />)}
    />
  );
};

export default RouteGuard;
