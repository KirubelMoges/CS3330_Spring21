import React, { useContext, useState, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useHistory, Link } from "react-router-dom";
import { UserContext } from "../../common/context";
import Header from "../header";
import { UserRepository } from "../../api/userRepository";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  const userRepository = new UserRepository();

  function validate() {
    return email.length > 5 && password.length > 0 && !isLoading;
  }

  const login = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const res = await userRepository.login(email, password);
    if (res) setIsLoading(false);
    if (!res.success) {
      setErrors(res);
    } else {
      setUserContext(userRepository.currentUser());
      history.push("/");
    }
  };

  useEffect(() => {
    const user = userContext;
    if (user.username) {
      console.log(user);
      history.push("/");
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
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
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
