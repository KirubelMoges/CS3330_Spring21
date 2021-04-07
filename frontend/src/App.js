import HomePage from './components/home';
import Login from './components/auth/login';
import Register from './components/auth/register';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import React, { useState } from 'react';
import { api } from './api';
import { UserContext } from './common/context';
import CalendarView from './components/calendar-view';

const App = () => {
  const [context, setContext] = useState(api.currentUser());

  return (
    <UserContext.Provider value={[context, setContext]}>
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={CalendarView} />
      </Router>
    </UserContext.Provider>
  );
};

// This is for a demo

export default App;
