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

    const spacing="card mx-5 my-2";

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
    else if(reservations.length>0){
        let covidStatus="Negative";
        if(user.covidStatus==1){
            covidStatus="Positive";
        }
        return<>
        <Header/>
        <div className="m-5">
            <h3>User Profile</h3>
            <div className= {spacing}>
                <h5 className= "card-header"> Name</h5>
                <p className= "card-body">{user.firstName} {user.lastName}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Email Address</h5>
                <p className= "card-body">{user.userEmail}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Role</h5>
                <p className= "card-body">{user.jobTitle}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">User ID</h5>
                <p className= "card-body">{user.userId}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Status</h5>
                <p className= "card-body">{covidStatus}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Reservations</h5>
                <table className=" card-body table table-condensed table-striped border my-0">
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
    else{
        let covidStatus="Negative";
        if(user.covidStatus==1){
            covidStatus="Positive";
        }
        return<>
        <Header/>
        <div className="m-5">
            <h3>User Profile</h3>
            <div className= {spacing}>
                <h5 className= "card-header">Name</h5>
                <p className= "card-body">{user.firstName} {user.lastName}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Email Address</h5>
                <p className= "card-body">{user.userEmail}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Role</h5>
                <p className= "card-body">{user.jobTitle}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">User ID</h5>
                <p className= "card-body">{user.userId}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Status</h5>
                <p className= "card-body">{covidStatus}</p>
            </div>
            <div className= {spacing}>
                <h5 className= "card-header">Reservations</h5>
                <p className= "card-body">No reservations made.</p>
            </div>
        </div>
        </>;
    }
};

export default UserProfile;