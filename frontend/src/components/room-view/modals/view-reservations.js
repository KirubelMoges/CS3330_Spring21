import { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { EmployeeRepository } from "../../../api/employeeRepository";
import { ManagerRepository } from "../../../api/managerRepository";
import { UserRepository } from "../../../api/userRepository";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { UserTypes } from "../../../utils/constants";

const UserInReservation = (props) => {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const userRepository = new UserRepository();

    if (!user && props.userId) {
      userRepository.getMoreUserInformationById(props.userId).then((res) => {
        if (res[1].success) {
          setUser(res[0][0]);
        }
      });
    }
  }, [user, setUser]);

  if (!user) return <p>No User!</p>;
  else return <>Reserved by - {user.userEmail} </>;
};

const ViewReservationsModal = (props) => {
  const [date, setDate] = useState(new Date());
  const [reservations, setReservations] = useState(undefined);
  const employeeRepository = new EmployeeRepository();
  const userRepository = new UserRepository();

  useEffect(() => {
    if (reservations === undefined) {
      employeeRepository
        .getReservations(date.getMonth() + 1, date.getFullYear())
        .then((data) => {
          if (data[1].success === true) {
            setReservations(data[0].data);
          } else {
            setReservations([]);
          }
        });
    }
  });

  return (
    <Modal show={props.show} onHide={props.handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>View Reservations</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Choose the date for which you want to view reservations:</p>
        <DatePicker
          selected={date}
          onChange={(d) => {
            if (
              d.getDate() !== date.getMonth() ||
              d.getFullYear() !== date.getFullYear()
            ) {
              employeeRepository
                .getReservations(d.getMonth() + 1, d.getFullYear())
                .then((res) => {
                  if (res[1].success) {
                    setReservations(res[0].data);
                  }
                });
            }
            setDate(d);
          }}
        />
        {reservations && (
          <div className="list-group mt-3">
            {reservations.map((reservation, index) => {
              const day = new Date(reservation.dateIn);
              const room = reservation.roomId;
              if (
                day.getDate() == date.getDate() &&
                day.getMonth() == date.getMonth() &&
                day.getFullYear() == date.getFullYear() &&
                room == props.roomId
              ) {
                let canDelete =
                  userRepository.currentUser().role == UserTypes.manager ||
                  userRepository.currentUser().userId == reservation.userId;
                return (
                  <div className="list-group-item" key={index}>
                    <div className="d-flex flex-row align-items-center justify-content-between">
                      Room Id: {reservation.roomId} <br />
                      <UserInReservation userId={reservation.userId} />
                      {canDelete && (
                        <button
                          className="btn btn-danger float-right"
                          onClick={() => {
                            const managerRepository = new ManagerRepository();
                            managerRepository
                              .deleteReservation(reservation.reservationId)
                              .then((res) => {
                                if (res[1].success) {
                                  const newReservations = reservations.filter(
                                    (r) =>
                                      r.reservationId !=
                                      reservation.reservationId
                                  );
                                  setReservations(newReservations);
                                }
                              });
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                );
              } else {
                return null;
              }
            })}
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={props.handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewReservationsModal;
