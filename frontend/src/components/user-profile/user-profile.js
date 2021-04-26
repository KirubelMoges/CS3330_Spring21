import React, { useEffect, useState } from 'react';
import { UserRepository } from '../../api/userRepository';
//import { EmployeeRepository } from '../../api/employeeRepository';
import Header from '../header';

export const UserProfile = props => {

    const userRepository = new UserRepository();

    const [user, setUser] = useState(undefined);

    const userId=props.match.params.userId;

    const currUser = userRepository.currentUser();

    useEffect(()=>{
        if(!user){
            console.log(userId);
            userRepository.getUserById(userId)
                .then(response => {
                    if(response[1].success===true){
                        setUser(response[0].data[0])
                    }
                    else{
                        console.log("error fetching profile")
                    }
                    });
        }
    });

    if(!user){
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
        </div>
        </>;
    }
};

export default UserProfile;