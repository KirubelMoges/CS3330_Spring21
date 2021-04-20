import React from 'react';
import {Container } from 'react-bootstrap';
import {Link } from 'react-router-dom';
import Header from '../header';

const About = () => {
    return (
        <div>
        <Header />
        <Container>
          <div className="py-5 my-5">
            <h1 className="text-center">About</h1>
            <h4 className="text-center text-muted">
              Making the world safer, one plan at a time.
            </h4>
          </div>
          <section className="text-center my-5" id="testimonials">
            <h2 className="h1-responsive font-weight-bold mt-5">Employees</h2>
            <p className="dark-grey-text w-responsive mx-auto mb-3">
                Get To Know the <Link to="/employees">Employees</Link>!
            </p>
          </section>
        </Container>
      </div>
    )
}
export default About;