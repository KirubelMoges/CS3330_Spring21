import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const loginHeader = () => {
  return <h1 className="display-4">Login</h1>;
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  function validate() {
    return email.length > 5 && password.length > 0;
  }

  function handleSubmit(e) {
    if (email == 'walln@smu.edu' && password == '123') {
      history.push('/');
    }
    e.preventDefault();
  }

  return (
    <Container>
      <div>
        <h1 className="display-4">Login</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group size="md" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              autoFocus
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="lg" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
