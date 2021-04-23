import React, { useState, useEffect } from "react";
import Header from "../header";
import { RoomsRepository } from "../../api/roomsRepository";
import { UserRepository } from "../../api/userRepository";

const RoomView = () => {
  const userRepository = new UserRepository();
  const currUser = userRepository.currentUser();
  const [rooms, setRooms] = useState(undefined);

  useEffect(() => {
    const roomsRepository = new RoomsRepository();
    if (rooms === undefined) {
      roomsRepository
        .getRooms(currUser.username, currUser.password)
        .then((data) => {
          if (data[1].success === true) {
            setRooms(data[0].data);
          } else {
            setRooms([]);
          }
        });
    }
  }, [rooms]);

  return (
    <>
      <Header />
      <div className="container mb-4">
        <table className="table table-striped">
          <thead className="border-top-0">
            <tr>
              <th className="h3">Available Rooms</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms &&
              rooms.map((room) => {
                return (
                  room.availability == 1 && (
                    <tr key={room.roomId}>
                      <td>Room: {room.roomId}</td>
                      <td>Capacity: {room.capacity}</td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
        <table className="table table-striped">
          <thead className="border-top-0">
            <tr>
              <th className="h3">Occupied Rooms</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms &&
              rooms.map((room) => {
                return (
                  !room.availability && (
                    <tr key={room.roomId}>
                      <td>Room: {room.roomId}</td>
                      <td>Capacity: {room.capacity}</td>
                      <td>Occupants: {room.currentEmployees}</td>
                    </tr>
                  )
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default RoomView;
