import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { api } from '../../api';
import { UserContext } from '../../common/context';
import axios from 'axios';
import Header from '../header';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    return email.length > 5 && password.length > 0 && !isLoading;
  }

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await axios.get('http://localhost:8000/api/login', {
      params: { userEmail: email, userPassword: password }
    });
    if (res.status <= 204) {
      setIsLoading(false);
      switch (res.data.status) {
        case 1:
          setErrors({ email: 'There is no user with this email' });
          break;
        case 2:
          setErrors({ password: 'Incorrect password' });
          break;
        default:
          sessionStorage.setItem(
            'user',
            JSON.stringify({
              username: email,
              role: 'employee',
              userId: res.data.userId,
              officeId: res.data.officeId
            })
          );
          setUserContext(api.currentUser());
          history.push('/');
          break;
      }
    }
  };

  useEffect(() => {
    const user = userContext;
    if (user.username) {
      console.log(user);
      history.push('/');
    }
  });

  return (
    <div>
    <Header />
    <Container className="p-3">
      <div>
        <h1 className="display-4">Login</h1>
        <p className="text-sm">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <Form onSubmit={login}>
          <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          <Form.Group size="md" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              isInvalid={errors.email !== undefined}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isInvalid={errors.password !== undefined}
            />
          </Form.Group>
          <Button block size="lg" type="submit" disabled={!validate()}>
            Login
          </Button>
        </Form>
      </div>
    </Container>
    </div>
  );
};

export default Login;
