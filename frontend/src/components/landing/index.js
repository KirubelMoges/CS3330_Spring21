import React from "react";
import { Container, Card, CardGroup } from "react-bootstrap";
import { Link } from "react-router-dom";
import Header from "../header";
import "./landing.css";

const LandingPage = () => {
  return (
    <>
      <Header />
      <div className="bg-image">
        <Container>
          <div className="py-5 my-5">
            <h1 className="text-center ">Evolve your Office Management</h1>
            <h4 className="text-center text-dark font-weight-bold">
              Organize your employees and workplace with our revolutionary
              managment platform.
            </h4>
          </div>
          <div className="py-5 my-5">
            <h1 className="text-center">
              <Link to="/login">Login</Link>
              <Link to="/register" className="ml-5">
                Register
              </Link>
            </h1>
          </div>
        </Container>
      </div>
    </>
  );
};

export default LandingPage;
