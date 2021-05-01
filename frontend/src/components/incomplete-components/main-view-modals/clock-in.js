import { Modal, Form } from 'react-bootstrap';
import { ClockRepository } from '../../../api/clockingRepository';
import { UserRepository } from '../../../api/userRepository';
import { useState } from 'react';
import { UserTypes } from '../../../utils/constants';

export const ClockInModal = (props) => {
  const clockRepository = new ClockRepository();
  const userRepository = new UserRepository();

  const regexp = /^[0-9\b]+$/;

  const [roomId, setRoomId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const validate = () => roomId !== '' || regexp.test(roomId);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Clock In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Welcome to the office! Your time will be logged and will be reported until you clock out.
        </p>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group size="md" controlId="email">
            <Form.Label>Room ID</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              isInvalid={false}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-primary"
          onClick={async () => {
            setIsLoading(true);
            const room = parseInt(roomId);
            const userId = userRepository.currentUser().userId;
            const res = await clockRepository.clockIn(userId, Date.now(), room, UserTypes.employee);
            setIsLoading(false);

            if (res[1].success === true) props.handleClose();
            else setError(res[1].reason);
          }}
          disabled={!validate() || isLoading}
        >
          Submit
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setError(undefined);
            props.handleClose();
          }}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export const ClockOutModal = (props) => {
  const clockRepository = new ClockRepository();
  const userRepository = new UserRepository();

  const regexp = /^[0-9\b]+$/;

  const [roomId, setRoomId] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const validate = () => roomId !== '' || regexp.test(roomId);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Clock In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Leaving already? Your time will stop being logged.</p>
        {error && <p className="text-danger">{error}</p>}
        <Form>
          <Form.Group size="md" controlId="email">
            <Form.Label>Room ID</Form.Label>
            <Form.Control
              autoFocus
              type="number"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              isInvalid={false}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-primary"
          onClick={async () => {
            setIsLoading(true);
            const room = parseInt(roomId);
            const userId = userRepository.currentUser().userId;
            const res = await clockRepository.clockOut(
              userId,
              Date.now(),
              room,
              UserTypes.employee
            );

            if (res[1].success === true) props.handleClose();
            else setError(res[1].reason);
            setIsLoading(false);
          }}
          disabled={!validate() || isLoading}
        >
          Submit
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            setError(undefined);
            props.handleClose();
          }}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};
