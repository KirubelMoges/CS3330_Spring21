import { Modal } from 'react-bootstrap';

const ClockInModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Clock In</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Welcome to the office! Your time will be logged starting now and will be reported until you
        clock out.
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClockInModal;
