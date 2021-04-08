import { Modal } from 'react-bootstrap';
import { useState } from 'react';

const ManagerRoomsModal = (props) => {
  const rooms = [...props.rooms];
  const events = [...props.events];

  const [isEventsModalShowing, setIsEventsModalShowing] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(rooms[0]);
  const handleEventsOpen = (room) => {
    setCurrentRoom(room);
    setIsEventsModalShowing(true);
  };
  const handleEventsClose = () => setIsEventsModalShowing(false);

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Manage your rooms</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <p>As a manager you control what rooms are available for scheduling.</p>
          {rooms.map((room, idx) => {
            return (
              <div className="d-flex flex-row justify-content-between py-1" key={idx}>
                <p>Room - {room}</p>
                <button className="btn btn-info" onClick={() => handleEventsOpen(room)}>
                  Manage Events
                </button>
                <button className="btn btn-danger">Remove from office</button>
              </div>
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
      <ManageEventsModal
        show={isEventsModalShowing}
        handleClose={handleEventsClose}
        room={currentRoom}
        events={events}
      />
    </Modal>
  );
};

const ManageEventsModal = (props) => {
  const events = [...props.events];
  console.log('Room', props.room);
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Manage Events</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <p>As a manager you control what events can happen.</p>
          {events.map((event, idx) => {
            console.log('Event Room', event.room);
            if (event.room == props.room) {
              return (
                <div className="d-flex flex-row justify-content-between py-1" key={idx}>
                  <p>
                    Event - {event.employee} - {event.day.toDateString()}
                  </p>

                  <button className="btn btn-danger">Remove event</button>
                </div>
              );
            }
            return <div />;
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ManagerRoomsModal;
