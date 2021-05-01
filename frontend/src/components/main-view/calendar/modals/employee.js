import { useState } from 'react';
import { Form, Modal } from 'react-bootstrap';
import { UserRepository } from '../../../../api/userRepository';

const EmployeeScheduleMoal = (props) => {
  const rooms = [...props.rooms];
  const [selectedRoom, setSelectedRoom] = useState(rooms[0].roomId);
  const date = new Date(props.date);
  const userRepository = new UserRepository();

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Schedule a Room</Modal.Title>
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
        </Form>
      </Modal.Body>

      <Modal.Footer>
        {rooms.length > 0 && (
          <button
            className="btn btn-success"
            onClick={() => {
              const reservationRoom = rooms.find((rm) => {
                return rm.roomId === selectedRoom;
              });
              const userRepository = new UserRepository();
              props.handleReserve(props.date, reservationRoom, userRepository.currentUser());
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

export default EmployeeScheduleMoal;
