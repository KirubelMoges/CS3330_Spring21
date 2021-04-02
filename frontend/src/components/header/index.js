import { Navbar, Nav } from 'react-bootstrap';
import { useContext, useState } from 'react';
import { UserContext } from '../../common/context';
import { api } from '../../api';

const Header = () => {
  const [userContext] = useContext(UserContext);
  const [loggedIn] = useState(Object.keys(userContext).length !== 0);

  return (
    <Navbar className="mr-auto" expand="lg">
      <Navbar.Brand href="/">Covid Workplace Planning Tool</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/about">About</Nav.Link>
        </Nav>
        {loggedIn ? <LoggedInVariant /> : <LoggedOutVariant />}
      </Navbar.Collapse>
    </Navbar>
  );
};

const LoggedOutVariant = () => {
  return (
    <Nav>
      <Nav.Item>
        <Nav.Link href="/login">Login</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/register">Sign Up</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

const LoggedInVariant = () => {
  const [, setUserContext] = useContext(UserContext);
  function logoutButton() {
    api.logout();
    setUserContext({});
  }

  return (
    <Nav>
      <Nav.Item>
        <Nav.Link onClick={logoutButton}>Logout</Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Header;
