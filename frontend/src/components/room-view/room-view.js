import React, { useState, useEffect } from "react";
import Header from "../header";
import { RoomsRepository } from "../../api/roomsRepository";
import { UserRepository } from "../../api/userRepository";
import { ManagerRepository } from "../../api/managerRepository";
import { UserTypes } from "../../utils/constants";
import CreateRoomModal from "./modals/create-room";

const RoomView = () => {
  const [isCreateRoomModalShowing, setIsCreateRoomModalShowing] = useState(
    false
  );
  const handleCreateRoomClose = () => setIsCreateRoomModalShowing(false);
  const handleCreateRoomOpen = () => setIsCreateRoomModalShowing(true);

  const userRepository = new UserRepository();
  const managerRepository = new ManagerRepository();
  const currUser = userRepository.currentUser();
  const [rooms, setRooms] = useState(undefined);
  const roomsRepository = new RoomsRepository();

  useEffect(() => {
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
              <th>
                <span className="h3">Rooms</span>
                <button
                  className="btn btn-success float-right"
                  type="button"
                  onClick={handleCreateRoomOpen}
                >
                  New Room
                </button>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms &&
              rooms.map((room) => {
                return (
                  <tr key={room.roomId}>
                    <td>Room: {room.roomId}</td>
                    <td>Capacity: {room.capacity}</td>
                    {/* {userRepository.currentUser().role == UserTypes.manager && (
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => {
                            managerRepository
                              .deleteRoom(room.roomId)
                              .then((res) => {
                                console.log({ res });
                                let newRooms = rooms;
                                setRooms(
                                  newRooms.filter(
                                    (newRoom) => newRoom.roomId != room.roomId
                                  )
                                );
                              });
                          }}
                        >
                          Delete Room
                        </button>
                      </td>
                    )} */}
                  </tr>
                );
              })}
          </tbody>
        </table>
        <CreateRoomModal
          handleClose={handleCreateRoomClose}
          show={isCreateRoomModalShowing}
          setRooms={setRooms}
          rooms={rooms}
        />
      </div>
    </>
  );
};

export default RoomView;
