import React, { useState, useEffect } from "react";
import Header from "../header";

const EmployeeList = () => {
  const [users, setUsers] = useState([
    { username: "test1", userId: 1, exposure: false, covidStatus: 0 },
    { username: "test2", userId: 2, exposure: true, covidStatus: 0 },
    { username: "test3", userId: 3, exposure: true, covidStatus: 0 },
    { username: "test4", userId: 4, exposure: false, covidStatus: 1 },
  ]);

  return (
    <div>
      <Header />
      <div class="container mb-4">
        <table className="table table-striped">
          <thead className="border-top-0">
            <tr>
              <th className="h3 table-success">Available Employees</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  user.covidStatus == 0 &&
                  user.exposure == false && (
                    <tr key={user.userId}>
                      <td>{user.username}</td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
        <table className="table table-striped">
          <thead className="border-top-0">
            <tr>
              <th className="h3 table-warning">Contact-Traced Employees</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  user.covidStatus == 0 &&
                  user.exposure == true && (
                    <tr key={user.userId}>
                      <td>{user.username}</td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
        <table className="table table-striped">
          <thead className="border-top-0">
            <tr>
              <th className="h3 table-danger">Employees with COVID-19</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (
                  user.covidStatus == 1 && (
                    <tr key={user.userId}>
                      <td>{user.username}</td>
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
