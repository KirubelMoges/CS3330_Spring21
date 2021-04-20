import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../common/context';
import LandingPage from '../landing';
import CalendarView from '../calendar-view';

const LoggedInView = () => {
  return <CalendarView />;
};

const HomePage = () => {
  const [userContext] = useContext(UserContext);
  const [loggedIn, setLoggedIn] = useState(Object.keys(userContext).length !== 0);

  useEffect(() => {
    setLoggedIn(Object.keys(userContext).length !== 0);
  }, [userContext, loggedIn, setLoggedIn]);

  return loggedIn ? <LoggedInView /> : <LandingPage />;
};

export default HomePage;
