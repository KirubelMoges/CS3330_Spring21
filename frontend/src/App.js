import HomePage from './components/home';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import React, { useState } from 'react';
import { UserContext } from './common/context';
import EmployeeList from './components/employee-list/employee-list';
import About from './components/header/about';
import { UserRepository } from './api/userRepository';
import Inbox from './components/inbox';
import RoomView from './components/room-view/room-view';
import RouteGuard from './components/routeGuard';

const App = () => {
  const userRepository = new UserRepository();
  const [context, setContext] = useState(userRepository.currentUser());

  return (
    <UserContext.Provider value={[context, setContext]}>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <RouteGuard exact path="/employees" component={EmployeeList} />
        <RouteGuard exact path="/rooms" component={RoomView} />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
