import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { api } from '../../api';
import { UserContext } from '../../common/context';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);

  function validate() {
    return email.length > 5 && password.length > 0;
  }

  function handleSubmit(e) {
    const res = api.login(email, password);
    if (res.email || res.password) {
      setErrors(res);
    } else {
      setUserContext(api.currentUser());
      history.push('/');
    }
    e.preventDefault();
  }

  useEffect(() => {
    const user = userContext;
    if (user.username) {
      console.log(user);
      history.push('/');
    }
  });

  return (
    <Container className="p-3">
      <div>
        <h1 className="display-4">Login</h1>
        <p className="text-sm">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
        <Form onSubmit={handleSubmit}>
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
  );
};

export default Login;
