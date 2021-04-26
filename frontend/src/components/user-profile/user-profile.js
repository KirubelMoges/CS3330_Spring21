import React, { useEffect, useState } from 'react';
import { UserRepository } from '../../api/userRepository';
import { EmployeeRepository } from '../../api/employeeRepository';
import Header from '../header';

export const UserProfile = props => {

    const userRepository = new UserRepository();
    const employeeRepository = new EmployeeRepository();

    const [user, setUser] = useState(undefined);
    const [reservations, setReservations] = useState(undefined);
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());

    const userId=props.match.params.userId;

    const currUser = userRepository.currentUser();

    useEffect(()=>{
        if(!user){
            userRepository.getUserById(userId)
                .then(response => {
                    if(response[1].success){
                        setUser(response[0].data[0]);
                    }
                    else{
                        console.log("error fetching profile "+userId);
                    }
                    });
        }
        if(!reservations){
            employeeRepository.getReservations(month, year)
            .then((res) => {
                if (res[1].success) {
                    let resArr=[];
                    res[0].data.forEach(element => {
                        if(element.userId==userId){
                            resArr.push(element);
                        }
                    });
                    setReservations(resArr);
                } else {
                    console.log("error fetching reservations for "+new Date().getMonth()+" "+new Date().getFullYear());
                    setReservations([]);
                }
              });
        }
    });

    if(!user || !reservations){
        return <>
        <div>Error: Profile userId:{userId} not found </div>
        </>
    }
    else{
        let covidStatus="Negative";
        if(user.covidStatus==1){
            covidStatus="Positive";
        }
        return<>
        <Header/>
        <div className="m-5">
            <h3>User Profile</h3>
            <div className= "m-5">
                <h5>Name</h5>
                <p>{user.firstName} {user.lastName}</p>
            </div>
            <div className= "m-5">
                <h5>Email Address</h5>
                <p>{user.userEmail}</p>
            </div>
            <div className= "m-5">
                <h5>Role</h5>
                <p>{user.jobTitle}</p>
            </div>
            <div className= "m-5">
                <h5>User ID</h5>
                <p>{user.userId}</p>
            </div>
            <div className= "m-5">
                <h5>Status</h5>
                <p>{covidStatus}</p>
            </div>
            <div className= "m-5">
                <h5>Reservations</h5>
                <table className=" table table-condensed table-striped border">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Room Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            reservations.map(reservation => 
                            {
                                return(
                                    <tr key = {reservation.reservationId}>
                                        <td>{new Date(reservation.dateIn).toDateString()}</td>
                                        <td>{reservation.roomId}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
        </>;
    }
};

export default UserProfile;