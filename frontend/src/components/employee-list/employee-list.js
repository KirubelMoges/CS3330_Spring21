import React, { useState, useEffect, Link } from "react";
import Header from "../header";
import { UserRepository } from "../../api/userRepository";
import { useHistory } from 'react-router-dom';

const EmployeeList = () => {
  const [users, setUsers] = useState(undefined);
  const history = useHistory();

  useEffect(() => {
    const userRepository = new UserRepository();
    if (users === undefined) {
      userRepository.getAllUsers().then((data) => {
        if (data[1].success === true) {
          setUsers(data[0].data);
          console.log(data);
        } else {
          setUsers([]);
        }
      });
    }
  });

  return (
    <div>
      <Header />
      <div class="container mb-4">

      { /* Start of Available Employee Table */}
        <table className=" table table-condensed table-striped border">
          <thead>
            <tr>
              <th className="h3 table-success rounded-top">Available Employees</th>
            </tr>
            
          </thead>
          <tbody>
            {users &&
              users.map((user) => {

                console.log(user);
                return (
                  user.covidStatus != 1 &&
                  user.exposure == false && (
                    // Need to reimplement the checks
                    <tr key={user.userId}>
                      <td>
                        <span className='text-muted'>{user.userId}</span>  
                        <span className='fs-1'>{' ' + user.firstName + ' ' + user.lastName}</span>
                        <a className='btn btn-info float-right' onClick={() => history.push('/profile/' + user.userId)}>See Profile</a>
                        

                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>

        { /* Start of Contact Traced Employee Table */}
        <table className="table table-striped border">
          <thead >
            <tr>
              <th className="h3 table-warning">Contact-Traced Employees</th>
              
            </tr>
          </thead>
          <tbody>
            {users &&
              users.map((user) => {
                return (

                  user.covidStatus != 1 &&
                  user.exposure == true && (
                    <tr key={user.userId}>
                      <td>
                        <td>
                        <span className='text-muted'>{user.userId}</span>  
                        <span className='fs-1'>{' ' + user.firstName + ' ' + user.lastName}</span>
                        <a className='btn btn-info float-right' onClick={() => history.push('/profile/' + user.userId)}>See Profile</a>

                      </td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>

        { /* Start of Employees with Covid-19 Table */}
        <table className="table table-striped border">
          <thead >
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
                        <span className='text-muted'>{user.userId}</span>  
                        <span className='fs-1'>{' ' + user.firstName + ' ' + user.lastName}</span>
                        <a className='btn btn-info float-right' onClick={() => history.push('/profile/' + user.userId)}>See Profile</a>

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
