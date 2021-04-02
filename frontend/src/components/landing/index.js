import React from 'react';
import { Container, Card, CardGroup } from 'react-bootstrap';
import Header from '../header';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <Container>
        <div className="py-5 my-5">
          <h1 className="text-center">Evolve your office management</h1>
          <h4 className="text-center text-muted">
            Keep track of and organize your employees and workplace with our revolutionary managment
            software.
          </h4>
        </div>
        <section className="text-center my-5" id="testimonials">
          <h2 className="h1-responsive font-weight-bold mt-5">Testimonials</h2>
          <p className="dark-grey-text w-responsive mx-auto mb-3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit, error amet numquam iure
            provident voluptate esse quasi, veritatis totam voluptas nostrum quisquam eum porro a
            pariatur veniam.
          </p>
          <CardGroup>
            <Card>
              <Card.Img variant="top" src="logo512.png" />
              <Card.Body>
                <Card.Title>Jane Doe</Card.Title>
                <Card.Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor, neque sed
                  semper varius, velit sapien porta neque, et ornare sem ipsum auctor massa. Aliquam
                  luctus mauris nec velit interdum efficitur. Donec nunc turpis, euismod vel neque
                  non, volutpat rutrum mi. Ut tempor porttitor sem, id vulputate elit tempor nec.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Img variant="top" src="logo512.png" />
              <Card.Body>
                <Card.Title>John Doe</Card.Title>
                <Card.Text>
                  Duis eu ante tellus. Proin pharetra lobortis massa, non hendrerit lectus elementum
                  ac. Fusce at velit leo. Duis eu ante tellus. Proin pharetra lobortis massa, non
                  hendrerit lectus elementum ac. Fusce at velit leo. Phasellus ut urna feugiat,
                  sollicitudin purus vitae, tincidunt velit.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
            <Card>
              <Card.Img variant="top" src="logo512.png" />
              <Card.Body>
                <Card.Title>John Deere</Card.Title>
                <Card.Text>
                  urabitur id purus id turpis ornare rutrum. Cras lacus arcu, elementum at justo
                  facilisis, facilisis porta dui. Donec odio sem, bibendum ultrices nunc vitae,
                  mollis interdum tellus. In hac habitasse platea dictumst. Aenean est odio,
                  efficitur et augue eu, dictum semper nisl. Nam eu ante sollicitudin, pharetra ante
                  nec, porta mauris.
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                <small className="text-muted">Last updated 3 mins ago</small>
              </Card.Footer>
            </Card>
          </CardGroup>
        </section>
      </Container>
    </div>
  );
};

export default LandingPage;
