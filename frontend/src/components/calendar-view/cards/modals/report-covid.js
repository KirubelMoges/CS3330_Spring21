import { Modal } from "react-bootstrap";

const ReportCovidModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Report Covid</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="font-weight-bold text-center">
          THIS ACTION CANNOT BE UNDONE
        </p>
        <p>Report that you have the COVID-19 virus.</p>
      </Modal.Body>
      <Modal.Footer>
        <button
          className="btn btn-danger"
          onClick={() => {
            alert("Your manager will be notified.");
            props.reportCovid();
            props.handleClose();
          }}
        >
          Report Covid
        </button>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReportCovidModal;
