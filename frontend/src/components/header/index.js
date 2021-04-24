import { Navbar, Nav } from 'react-bootstrap';
import { useContext } from 'react';
import { UserContext } from '../../common/context';
import { UserRepository } from '../../api/userRepository';
import { useHistory } from 'react-router';

const Header = () => {
  const userRepository = new UserRepository();

  return (
    <Navbar className="mr-auto bg-light mb-2" expand="lg">
      <Navbar.Brand href="/">Covid Workplace Planning Tool</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/about">About</Nav.Link>
          <Nav.Link href="/employees">Employees</Nav.Link>
          <Nav.Link href="/rooms">Rooms</Nav.Link>
          <Nav.Link href="/covid">Covid Cases</Nav.Link>
          <Nav.Link href="/inbox">Inbox</Nav.Link>
        </Nav>
        {userRepository.loggedIn() ? <LoggedInVariant /> : <LoggedOutVariant />}
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
  const userRepository = new UserRepository();
  const history = useHistory();
  function logoutButton() {
    userRepository.logout();
    setUserContext({});
    history.push('/login');
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
