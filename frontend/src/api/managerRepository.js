import axios from "axios";
import { URL, UserTypes } from "../utils/constants";

export class ManagerRepository {
  /**
   * Create a reservation for a specific user
   * @param {number} roomId - The id of the room to reserve
   * @param {Date} dateIn - The starting date of the reservation
   * @param {Date} dateOut - The ending date of the reservation
   * @param {number} userId - The id of the user reserving the room
   * @returns {Promise<[Object, Object]>} - Data, Error tuple
   */
  async createReservation(roomId, dateIn, dateOut, userId) {
    const errors = { success: false };
    const { data, status } = await axios.post(
      URL + "/api/manager/addReservation",
      {},
      {
        params: {
          roomId,
          dateIn,
          dateOut,
          userId,
        },
      }
    );

    if (status >= 201) errors.reason = "Bad Request";
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Delete a specific room
   * @param {name} name - The name of the room to delete
   * @param {number} roomId - The id of the room to deletee
   */
  async deleteRoom(roomId) {
    const errors = { success: false };
    const { data, status } = await axios.delete(URL + "/api/manager/room", {
      params: { roomId },
    });

    if (status >= 201) {
      errors.reason = "Bad Request";
    } else if (data.status && data.status === 1) {
      errors.reason = "Unauthenticated";
    } else {
      errors.success = true;
    }

    return [data, errors];
  }

  /**
   * Delete a reservation
   * @param {number} reservationId - The id of the reservation to delete
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async deleteReservation(reservationId) {
    const errors = { success: false };
    const { data, status } = await axios.delete(
      URL + "/api/manager/deleteReservation",
      {
        params: {
          reservationId,
        },
      }
    );

    if (status >= 201) errors.reason = "Bad Request";
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Update a users role
   * @param {number} userId - the id of the user to update
   * @param {string} jobTitle - the title to update to
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async updateRole(userId, jobTitle = UserTypes.manager) {
    const errors = { success: true };
    const { data, status } = await axios.put(
      URL + "/api/manager/editJobTitle",
      {},
      {
        params: {
          userId,
          jobTitle,
        },
      }
    );

    if (status >= 201) errors.reason = "Bad Request";
    else errors.success = true;

    return [data, errors];
  }
}
