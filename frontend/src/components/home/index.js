import { useEffect, useState } from 'react';
import LandingPage from '../landing';
import CalendarView from '../calendar-view';
import { UserRepository } from '../../api/userRepository';

const LoggedInView = () => {
  return <CalendarView />;
};

const HomePage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => {
    const userRepository = new UserRepository();
    const getUser = () => {
      userRepository.getMoreUserInformationById(userRepository.currentUser().userId).then(() => {});
    };
    const isLoggedIn = userRepository.loggedIn();
    if (
      (isLoggedIn && !userRepository.currentUser().officeId) ||
      !userRepository.currentUser().covidStatus
    )
      getUser();
    setLoggedIn(isLoggedIn);
  }, [loggedIn, setLoggedIn]);

  return loggedIn ? <LoggedInView /> : <LandingPage />;
};

export default HomePage;
