import { Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const isLoggedin = true;
  const history = useHistory();

  function logoutButton() {
    history.push('/login');
  }

  return isLoggedin ? (
    <Container>
      <h1 className="display-3 text-center">Home Page</h1>
      <Button onClick={logoutButton}>Logout</Button>
    </Container>
  ) : (
    <div>
      <Button variant="primary">Test</Button>
    </div>
  );
};

export default HomePage;
