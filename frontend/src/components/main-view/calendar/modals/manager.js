import { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { UserRepository } from '../../../../api/userRepository';

const ManagerScheduleModal = (props) => {
  const rooms = [...props.rooms];
  const employees = [...props.employees];

  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]);
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].roomId);

  const date = new Date(props.date);
  const userRepository = new UserRepository();

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule an Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Selected Date: {date.toDateString()}</p>
        <Form>
          <Form.Group controlId="scheduleForm.room">
            <Form.Label>Room Number</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedRoom(e.target.value)}>
              {rooms.map((room, index) => {
                return room.officeId === userRepository.currentUser().officeId ? (
                  <option key={index}>{room.roomId}</option>
                ) : null;
              })}
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="scheduleForm.employee">
            <Form.Label>Employee</Form.Label>
            <Form.Control as="select" onChange={(e) => setSelectedEmployee(e.target.value)}>
              {employees.map((employee, index) => {
                return employee.officeId === userRepository.currentUser().officeId ? (
                  <option key={index}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ) : null;
              })}
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {rooms.length > 0 && employees.length > 0 && (
          <button
            className="btn btn-success"
            onClick={() => {
              const reservationRoom = rooms.find((rm) => {
                return rm.roomId == selectedRoom;
              });
              console.log(rooms);
              console.log(reservationRoom);
              props.handleReserve(props.date, reservationRoom, selectedEmployee);
            }}
          >
            Reserve
          </button>
        )}
        <button className="btn btn-danger" onClick={props.handleClose}>
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManagerScheduleModal;
