import { useState } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const CalendarHeader = (props) => {
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  const [formMonth, setFormMonth] = useState(props.month);
  const [formYear, setFormYear] = useState(props.year);

  return (
    <header>
      <div className="d-flex align-items-center justify-content-between mb-3 mt-6">
        <h2 className="month font-weight-bold mb-0 text-uppercase display-3">
          {labels[props.month - 1]} {props.year}
        </h2>
        <div className="ml-4 mr-1">
          <Row>
            <Form>
              <Col>
                <Form.Group controlId="calendar.selectMonth">
                  <Form.Label>Month</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={(e) => setFormMonth(e.target.value)}
                    value={formMonth}
                  >
                    {months.map((m, index) => (
                      <option key={index}>{m}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="calendar.selectYear">
                  <Form.Label>Year</Form.Label>
                  <Form.Control
                    as="input"
                    type="number"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Form>
            <div className="d-flex flex-column justify-content-center">
              <button
                className="btn btn-primary"
                onClick={() => {
                  props.sendMonthChangeRequest(formMonth, formYear);
                }}
              >
                Refresh Calendar
              </button>
            </div>
          </Row>
        </div>
      </div>
      <div className="row d-none d-sm-flex p-1 bg-dark text-white">
        <h5 className="col-sm p-1 text-center">Sunday</h5>
        <h5 className="col-sm p-1 text-center">Monday</h5>
        <h5 className="col-sm p-1 text-center">Tuesday</h5>
        <h5 className="col-sm p-1 text-center">Wednesday</h5>
        <h5 className="col-sm p-1 text-center">Thursday</h5>
        <h5 className="col-sm p-1 text-center">Friday</h5>
        <h5 className="col-sm p-1 text-center">Saturday</h5>
      </div>
    </header>
  );
};

export default CalendarHeader;
