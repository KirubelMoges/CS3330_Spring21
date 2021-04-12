import React, { useContext, useState, useEffect } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { useHistory, Link } from 'react-router-dom';
import { api } from '../../api';
import { UserContext } from '../../common/context';
import axios from 'axios';
import Header from '../header';

const EmployeeList = () => {

  const employees = ['Nick', 'Logan', 'Caesar', 'Blake', 'Elias', 'Kirubel', 'Seun', 'Tim'];

    return (
      <div>
      <Header />
      <div class="container mb-4">
        <div class = "container row">
          <h3 class="mb-2">There are {employees.length} employees currently working.</h3>
        </div>
          {
            !employees.length && <li className="list-group-item bg-light">There are no employees! Hire More</li>
          }
          {
            employees.map((x) => 
                <div class="card mb-3">
                    <div class="card-header">
                        {x}
                    </div>
                    <div class="card-body">
                      {/*I just added this button for me to see how it could look as well as maybe thinking of future functionality*/}
                      <button class="btn btn-primary" type="button">Hire</button>
                    </div>
                </div>
            )
          }
      </div>
      </div>
    );
};
  
export default EmployeeList;
