import React from 'react';

const EmployeeList = () => {

  const employees = ['Nick', 'Logan', 'Caesar', 'Blake', 'Elias', 'Kirubel', 'Seun', 'Tim'];

    return (
      <div class="container mb-4">
        <div class = "container row">
          <h3 class="mb-2">Employees</h3>
          <h3 class="mb-2 text-secondary">{"(" + employees.length + ")"}</h3>
        </div>
          {
            !employees.length && <li className="list-group-item bg-light">There are no employees!</li>
          }
          {
            employees.map((x) => 
                <div class="card mb-3">
                    <div class="card-header">
                        {x}
                    </div>
                </div>
            )
          }

      </div>
    
    );
};
  
export default EmployeeList;
