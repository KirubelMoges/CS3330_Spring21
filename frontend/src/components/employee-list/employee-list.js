import React, { useState, useEffect } from "react";
import Header from "../header";
import { UserRepository } from "../../api/userRepository";

const EmployeeList = () => {
  
  const [users, setUsers] = useState(undefined);

  useEffect(() => {
    const userRepository = new UserRepository(); 
    if (users === undefined) {
      userRepository.getAllUsers().then((data) => {
        if(data[1].success === true) {
          setUsers(data[0].data);
          console.log(data);
        } else {
          setUsers([]);
        }
      })
    }
  });

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
                console.log(user)
                return (
                  // user.status == 0 &&
                  // user.exposure == false && 
                  // Need to reimplement the checks
                  (
                    <tr key={user.userId}>
                      <td>{user.userId + ' ' + user.firstName + ' ' + user.lastName}</td>
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
                  // user.covidStatus == 0 &&
                  // user.exposure == true && 
                  (
                    <tr key={user.userId}>
                      <td>{user.userId + ' ' + user.firstName + ' ' + user.lastName}</td>
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
                  user.status == 1 && (
                    <tr key={user.userId}>
                      <td>{user.userId + ' ' + user.firstName + ' ' + user.lastName}</td>
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
