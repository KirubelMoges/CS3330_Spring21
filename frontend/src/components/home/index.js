import { useEffect, useState, useContext } from 'react';
import LandingPage from '../landing';
import CalendarView from '../calendar-view';
import { UserRepository } from '../../api/userRepository';
import { UserContext } from '../../common/context';

const LoggedInView = () => {
  return <CalendarView />;
};

const HomePage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [, setUserContext] = useContext(UserContext);
  useEffect(() => {
    const userRepository = new UserRepository();
    const getUser = () => {
      userRepository
        .getMoreUserInformationById(userRepository.currentUser().userId, true)
        .then(() => {
          setUserContext(userRepository.currentUser());
        });
    };
    const isLoggedIn = userRepository.loggedIn();
    if (
      (isLoggedIn && !userRepository.currentUser().officeId) ||
      !userRepository.currentUser().covidStatus ||
      !userRepository.currentUser().role
    )
      getUser();
    setLoggedIn(isLoggedIn);
  }, [loggedIn, setLoggedIn, setUserContext]);

  return loggedIn ? <LoggedInView /> : <LandingPage />;
};

export default HomePage;
