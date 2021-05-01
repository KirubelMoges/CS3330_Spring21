import { Modal } from 'react-bootstrap';

const RoomsModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Manage your rooms</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        As an employee you can select rooms to work or have meetings in. Available rooms will be
        listed here.
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default RoomsModal;
