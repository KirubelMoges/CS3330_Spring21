import React, { useEffect, useState } from "react";
import { UserRepository } from "../../api/userRepository";
import { EmployeeRepository } from "../../api/employeeRepository";
import Header from "../header";
import { UserTypes } from "../../utils/constants";
import { ManagerRepository } from "../../api/managerRepository";

const UserProfile = (props) => {
  const userRepository = new UserRepository();
  const employeeRepository = new EmployeeRepository();
  const managerRepository = new ManagerRepository();

  const [user, setUser] = useState(undefined);
  const [reservations, setReservations] = useState(undefined);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [canChangeStatus, setCanChangeStatus] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const [contacts, setContacts] = useState(undefined);

  const userId = props.match.params.userId;

  const currUser = userRepository.currentUser();

  useEffect(() => {
    if (!user) {
      userRepository.getUserById(userId).then((response) => {
        if (response[1].success) {
          setUser(response[0].data[0]);
          setIsManager(response[0].data[0].jobTitle == UserTypes.manager);
        } else {
        }
      });
    } else {
      setCanChangeStatus(
        userRepository.currentUser().role == UserTypes.manager &&
          user.userId != userRepository.currentUser().userId
      );
    }
    if (!reservations) {
      employeeRepository.getReservations(month, year).then((res) => {
        if (res[1].success) {
          let resArr = [];
          res[0].data.forEach((element) => {
            if (element.userId == userId) {
              resArr.push(element);
            }
          });
          setReservations(resArr);
        } else {
          setReservations([]);
        }
      });
    }
    if (!contacts) {
      userRepository.getAllPeopleInContactWithUserId(userId).then((res) => {
        if (res[1].success) {
          setContacts(res[0].data);
        } else {
          setContacts([]);
        }
      });
    }
  }, [
    user,
    reservations,
    setUser,
    setReservations,
    canChangeStatus,
    setCanChangeStatus,
    contacts,
    setContacts,
  ]);

  if (!user || !reservations) {
    return (
      <>
        <div>Error: Profile userId:{userId} not found </div>
      </>
    );
  } else {
    let covidStatus = "Negative";
    if (user.covidStatus == 1) {
      covidStatus = "Positive";
    }
    return (
      <>
        <Header />
        <div className="container mt-4">
          <h3>User Profile</h3>
          <div className="mt-4 ml-3">
            <div className="flex-row d-flex border-bottom border-dark">
              <p className="h5">Name: </p>
              <p className="ml-3">
                {user.firstName} {user.lastName}
              </p>
            </div>
          </div>
          <div className="mt-3 ml-3 flex-row d-flex border-bottom border-dark">
            <p className="h5">Email Address: </p>
            <p className="ml-3">{user.userEmail}</p>
          </div>
          <div className="mt-3 ml-3 flex-row d-flex border-bottom border-dark">
            <p className="h5">Role: </p>
            <p className="text-capitalize ml-3">{user.jobTitle}</p>

            <div style={{ marginTop: -6 }} className="ml-3">
              {canChangeStatus ? (
                isManager ? (
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      let updUser = user;
                      managerRepository
                        .updateRole(user.userId, UserTypes.employee)
                        .then((res) => {
                          updUser.jobTitle = UserTypes.employee;
                          setUser(updUser);
                          setCanChangeStatus(false);
                          setIsManager(false);
                        });
                    }}
                  >
                    Demote
                  </button>
                ) : (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      let updUser = user;
                      managerRepository
                        .updateRole(userId, UserTypes.manager)
                        .then((res) => {
                          updUser.jobTitle = UserTypes.manager;
                          setUser(updUser);
                          setCanChangeStatus(true);
                          setIsManager(true);
                        });
                    }}
                  >
                    Promote to Manager
                  </button>
                )
              ) : null}
            </div>
          </div>

          <div className="mt-3 ml-3 flex-row d-flex border-bottom border-dark">
            <p className="h5">User ID: </p>
            <p className="ml-3">{user.userId}</p>
          </div>
          <div className="mt-3 ml-3 flex-row d-flex border-bottom border-dark">
            <p className="h5">Covid Status: </p>
            <p className="ml-3">{covidStatus}</p>
          </div>
          <div className="mt-3 ml-3 border-bottom border-dark">
            <h5 className="mb-3">Contact Tracing History</h5>
            {contacts && contacts.length > 0 ? (
              <table className="table table-condensed table-striped border border-dark">
                <thead className="table-dark">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          {contact.firstName} {contact.lastName}
                        </td>
                        <td>{contact.userEmail}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>This user has never been contact traced</p>
            )}
          </div>
          <div className="mt-3 ml-3">
            <h5 className="mb-3">Reservations</h5>
            {user.covidStatus != 1 &&
            reservations &&
            reservations.length > 0 ? (
              <table className="table table-condensed table-striped border border-dark">
                <thead className="table-dark">
                  <tr>
                    <th>Date</th>
                    <th>Room Number</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => {
                    return (
                      <tr key={reservation.reservationId}>
                        <td>{new Date(reservation.dateIn).toDateString()}</td>
                        <td>{reservation.roomId}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <p>No Reservations</p>
            )}
          </div>
        </div>
      </>
    );
  }
};

export default UserProfile;
