import { Modal } from 'react-bootstrap';

const EmployeesModal = (props) => {
  const employees = [...props.employees];

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Manage your Employees</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column">
          <p>As an manager you can view your employees and manage their status.</p>
          {employees.map((employee, idx) => {
            return (
              <div className="d-flex flex-row justify-content-between py-1" key={idx}>
                <p>{employee}</p>
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
    </Modal>
  );
};

export default EmployeesModal;
