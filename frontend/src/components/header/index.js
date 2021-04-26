import { Navbar, Nav } from "react-bootstrap";
import { useContext } from "react";
import { UserContext } from "../../common/context";
import { UserRepository } from "../../api/userRepository";
import { useHistory } from "react-router";

const Header = () => {
  const userRepository = new UserRepository();

  return (
    <Navbar className="mr-auto bg-dark mb-2 navbar-dark" expand="lg">
      <Navbar.Brand href="/" className="text-white">
        Covid Workplace Planning Tool
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbar-nav" />
      <Navbar.Collapse id="navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/employees" className="text-white">
            Employees
          </Nav.Link>
          <Nav.Link href="/rooms" className="text-white">
            Rooms
          </Nav.Link>
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
        <Nav.Link href="/login" className="text-white">
          Login
        </Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link href="/register" className="text-white">
          Sign Up
        </Nav.Link>
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
    history.push("/login");
  }

  return (
    <Nav>
      <Nav.Item>
        <Nav.Link onClick={logoutButton} className="text-white">
          Logout
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Header;
