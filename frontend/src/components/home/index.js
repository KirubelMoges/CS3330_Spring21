import { useEffect, useState } from 'react';
import LandingPage from '../landing';
import CalendarView from '../calendar-view';
import { UserRepository } from '../../api/userRepository';

const LoggedInView = () => {
  return <CalendarView />;
};

const HomePage = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(async () => {
    const userRepository = new UserRepository();
    const getUser = async () => {
      await userRepository.getMoreUserInformationById(userRepository.currentUser().userId);
    };
    const isLoggedIn = userRepository.loggedIn();
    if (isLoggedIn && !userRepository.currentUser().officeId) getUser();
    setLoggedIn(isLoggedIn);
  }, [loggedIn, setLoggedIn]);

  return loggedIn ? <LoggedInView /> : <LandingPage />;
};

export default HomePage;
