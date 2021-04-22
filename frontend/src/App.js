import HomePage from './components/home';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import React, { useState } from 'react';
import { UserContext } from './common/context';
import EmployeeList from './components/employee-list/employee-list';
import About from './components/header/about';
import { UserRepository } from './api/userRepository';
import RoomView from './components/room-view/room-view';
import CovidView from './components/covid-view/covid-view';

const App = () => {
  const userRepository = new UserRepository();
  const [context, setContext] = useState(userRepository.currentUser());

  return (
    <UserContext.Provider value={[context, setContext]}>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/employees" component={EmployeeList} />
        <Route exact path="/about" component={About} />
        <Route exact path="/rooms" component={RoomView} />
        <Route exact path="/covid" component={CovidView} />
      </Router>
    </UserContext.Provider>
  );
};

export default App;
