import { useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { RoomsRepository } from "../../../api/roomsRepository";
import { UserRepository } from "../../../api/userRepository";

const CreateRoomModal = (props) => {
  const roomsRepository = new RoomsRepository();
  const userRepository = new UserRepository();
  const [capacity, setCapacity] = useState(50);
  const [roomName, setRoomName] = useState("");

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Set name of the new room and its capacity:</p>
        <Form>
          <Form.Group controlId="scheduleForm.room">
            <Form.Label>Room Name:</Form.Label>
            <Form.Control
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="scheduleForm.room">
            <Form.Label>Capacity:</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-success"
          onClick={() => {
            roomsRepository.createRoom(roomName, capacity).then((res) => {
              const newRoom = {
                roomId: res[0].data.insertId,
                name: roomName,
                capacity: capacity,
                officeId: userRepository.currentUser().officeId,
              };
              props.setRooms([...props.rooms, newRoom]);
              props.handleClose();
            });
          }}
        >
          Create Room
        </button>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateRoomModal;
