import { useContext, useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { UserContext } from '../../common/context';
import Header from '../header';
import LandingPage from '../landing';

const LoggedInView = () => {
  const [userContext] = useContext(UserContext);

  return (
    <div>
      <Header />
      <Container>
        <h1 className="display-3 text-center">Home Page</h1>
        <h3 className="text-md-center">Current user: {userContext.username}</h3>
      </Container>
    </div>
  );
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
