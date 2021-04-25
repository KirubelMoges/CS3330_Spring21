import React, { useState, useEffect, Link } from "react";
import Header from "../header";
import { UserRepository } from "../../api/userRepository";
import {
  EmployeeRepository,
  employeeRepository,
} from "../../api/employeeRepository";
import { useHistory } from "react-router-dom";
import { UserTypes } from "../../utils/constants";

const EmployeeList = () => {
  const [users, setUsers] = useState(undefined);
  const history = useHistory();
  const userRepository = new UserRepository();
  const employeeRepository = new EmployeeRepository();

  useEffect(() => {
    if (users === undefined) {
      userRepository.getAllUsers().then((data) => {
        if (data[1].success === true) {
          setUsers(data[0].data);
          //console.log(data);
        } else {
          setUsers([]);
        }
      });
    }
  });

  return (
    <div>
      <Header />
      <div className="container mb-4">
        {/* Start of Available Employee Table */}
        <table className=" table table-condensed table-striped border">
          <thead>
            <tr>
              <th className="h3 table-success rounded-top">
                Available Employees
              </th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                //console.log(user);
                return (
                  user.covidStatus != 1 &&
                  user.exposure == 0 && (
                    <tr key={user.userId}>
                      <td>
                        <span className="text-muted">{user.userId}</span>
                        <span className="fs-1">
                          {" " + user.firstName + " " + user.lastName}
                        </span>
                        <a
                          className="btn btn-info float-right"
                          onClick={() =>
                            history.push("/profile/" + user.userId)
                          }
                        >
                          See Profile
                        </a>
                        {userRepository.currentUser().role ==
                          UserTypes.manager && (
                          <button
                            type="button"
                            className="btn btn-danger float-right"
                            onClick={() => {
                              userRepository
                                .editCovidStatus(user.userId, 1)
                                .then(() => {
                                  let newUsers = users;
                                  newUsers = newUsers.map((newUser) => {
                                    if (newUser.userId == user.userId) {
                                      newUser.covidStatus = 1;
                                    }
                                    return newUser;
                                  });
                                  setUsers(newUsers);
                                });
                            }}
                          >
                            Tested Positive
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>

        {/* Start of Contact Traced Employee Table */}
        <table className="table table-striped border">
          <thead>
            <tr>
              <th className="h3 table-warning">Contact-Traced Employees</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  user.covidStatus != 1 &&
                  user.exposure == 1 && (
                    <tr key={user.userId}>
                      <td>
                        <span className="text-muted">{user.userId}</span>
                        <span className="fs-1">
                          {" " + user.firstName + " " + user.lastName}
                        </span>
                        <a
                          className="btn btn-info float-right"
                          onClick={() =>
                            history.push("/profile/" + user.userId)
                          }
                        >
                          See Profile
                        </a>
                        {userRepository.currentUser().role ==
                          UserTypes.manager && (
                          <>
                            <button
                              type="button"
                              className="btn btn-success float-right"
                              onClick={() => {
                                userRepository
                                  .editCovidStatus(user.userId, 0)
                                  .then(() => {
                                    employeeRepository
                                      .setExposure(user.userId, 0)
                                      .then();
                                    let newUsers = users;
                                    newUsers = newUsers.map((newUser) => {
                                      if (newUser.userId == user.userId) {
                                        newUser.covidStatus = 0;
                                        newUser.exposure = 0;
                                      }
                                      return newUser;
                                    });
                                    setUsers(newUsers);
                                  });
                              }}
                            >
                              Tested Negative
                            </button>
                            <button
                              type="button"
                              className="btn btn-danger float-right"
                              onClick={() => {
                                userRepository
                                  .editCovidStatus(user.userId, 1)
                                  .then(() => {
                                    let newUsers = users;
                                    newUsers = newUsers.map((newUser) => {
                                      if (newUser.userId == user.userId) {
                                        newUser.covidStatus = 1;
                                      }
                                      return newUser;
                                    });

                                    setUsers(newUsers);
                                  });
                              }}
                            >
                              Tested Positive
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>

        {/* Start of Employees with Covid-19 Table */}
        <table className="table table-striped border">
          <thead>
            <tr>
              <th className="h3 table-danger">Employees with COVID-19</th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  user.covidStatus == 1 && (
                    <tr key={user.userId}>
                      <td>
                        <span className="text-muted">{user.userId}</span>
                        <span className="fs-1">
                          {" " + user.firstName + " " + user.lastName}
                        </span>
                        <a
                          className="btn btn-info float-right"
                          onClick={() =>
                            history.push("/profile/" + user.userId)
                          }
                        >
                          See Profile
                        </a>
                        {userRepository.currentUser().role ==
                          UserTypes.manager && (
                          <button
                            type="button"
                            className="btn btn-success float-right"
                            onClick={() => {
                              userRepository
                                .editCovidStatus(user.userId, 0)
                                .then(() => {
                                  employeeRepository
                                    .setExposure(user.userId, 0)
                                    .then();
                                  let newUsers = users;
                                  newUsers = newUsers.map((newUser) => {
                                    if (newUser.userId == user.userId) {
                                      newUser.covidStatus = 0;
                                      newUser.exposure = 0;
                                    }
                                    return newUser;
                                  });
                                  setUsers(newUsers);
                                });
                            }}
                          >
                            Tested Negative
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeList;
