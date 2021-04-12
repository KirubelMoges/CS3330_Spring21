import React, { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { api } from '../../api';
import { UserContext } from '../../common/context';
import axios from 'axios';
import Header from '../header';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [officeId, setOfficeId] = useState(1);
  const [jobTitle] = useState('defaultJobTitle');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);

  function validate() {
    return email.length > 8 && password.length > 0 && firstName.length > 0 && lastName.length > 0;
  }

  const register = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:8000/api/createUser', {
      firstName,
      lastName,
      userEmail: email,
      userPassword: password,
      exposure: false,
      jobTitle,
      officeId
    });
    if (res.status <= 204) {
      sessionStorage.setItem(
        'user',
        JSON.stringify({ username: email, role: 'employee', userId: res.data.data.insertId })
      );
      setUserContext(api.currentUser());
      history.push('/');
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
        <h1 className="display-4">Register</h1>
        <p className="text-sm">
          Already have an account? <Link to="/login">Login</Link>
        </p>
        <Form onSubmit={register}>
          <Form.Group size="md" controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Form.Group>
          <Form.Group size="md" controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              autoFocus
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Form.Group>
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
          <Form.Group size="lg" controlId="officeId">
            <Form.Label>Office Id</Form.Label>
            <Form.Control
              type="number"
              value={officeId}
              onChange={(e) => setOfficeId(e.target.value)}
            />
          </Form.Group>
          <Button block size="lg" type="submit" disabled={!validate()}>
            Register
          </Button>
        </Form>
      </div>
    </Container>
    </div>
  );
};

export default Register;
