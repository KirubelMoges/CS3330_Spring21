import { useEffect, useState, useContext } from 'react';
import { Spinner } from 'react-bootstrap';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRepository = new UserRepository();
    const isLoggedIn = userRepository.loggedIn();

    if (isLoggedIn && !loggedIn) setLoggedIn(true);
    if (loggedIn && !isLoggedIn) setLoggedIn(false);
  });

  useEffect(() => {
    const userRepository = new UserRepository();
    const getUser = () => {
      userRepository
        .getMoreUserInformationById(userRepository.currentUser().userId, true)
        .then(() => {
          setUserContext(userRepository.currentUser());
        });
    };

    if (loggedIn) {
      if (
        !userRepository.currentUser().officeId ||
        !userRepository.currentUser().covidStatus ||
        !userRepository.currentUser().role ||
        userRepository.currentUser().covidStatus == null
      ) {
        getUser();
        setLoggedIn(true);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }
  }, [loggedIn, setLoggedIn, setUserContext, isLoading, setIsLoading]);

  if (loggedIn && isLoading) {
    return (
      <div className="row">
        <div className="col">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      </div>
    );

    if (loggedIn) console.log('Logged in');
  }

  return loggedIn ? <LoggedInView /> : <LandingPage />;
};

export default HomePage;
