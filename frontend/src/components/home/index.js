import { useContext, useEffect, useState } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { api } from '../../api';
import { UserContext } from '../../common/context';

const LoggedInView = () => {
  const [userContext, setUserContext] = useContext(UserContext);
  const history = useHistory();
  function logoutButton() {
    api.logout();
    setUserContext({});
    history.push('/login');
  }

  return (
    <Container>
      <h1 className="display-3 text-center">Home Page</h1>
      <h3 className="text-md-center">Current user: {userContext.username}</h3>
      <Row className="d-flex justify-content-around">
        <Button onClick={logoutButton}>Logout</Button>
      </Row>
    </Container>
  );
};

const LoggedOutView = () => {
  const history = useHistory();
  function login() {
    history.push('/login');
  }
  function register() {
    history.push('/register');
  }

  return (
    <Container className="p-3">
      <Row className="justify-content-center">
        <div>
          <Button className="m-3" onClick={login}>
            Login
          </Button>
          <Button className="m-3" onClick={register}>
            Register
          </Button>
        </div>
      </Row>
    </Container>
  );
};

const HomePage = () => {
  const [userContext] = useContext(UserContext);
  const [loggedIn, setLoggedIn] = useState(Object.keys(userContext).length !== 0);

  useEffect(() => {
    setLoggedIn(Object.keys(userContext).length !== 0);
  }, [userContext, loggedIn, setLoggedIn]);

  return loggedIn ? <LoggedInView /> : <LoggedOutView />;
};

export default HomePage;
