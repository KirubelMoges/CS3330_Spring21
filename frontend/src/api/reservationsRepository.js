import axios from 'axios';
import { URL } from '../utils/constants';

export class ReservationsRepository {
  /**
   * Attempt to reserve a room
   * @param {string} userEmail - The email of the user reserving a room
   * @param {string} userPassword - The password of the user reserving a room
   * @param {number} roomId - The id of the room to reserve
   * @param {Date} dateIn - The starting date of the reservation
   * @param {Date} dateOut - The ending date of the reservation
   * @param {[{Object}]]} additionalUsers - Any other users invited
   * @param {Date} sendDate - The time the request was made
   * @returns {Promise<[Object, Object]>} - Data,error tuple
   */
  async createReservation(
    userEmail,
    userPassword,
    roomId,
    dateIn,
    dateOut,
    additionalUsers = [],
    sendDate = new Date()
  ) {
    const errors = { success: false };
    const { data, status } = await axios.post(URL + '/api/reservation', {
      userEmail,
      userPassword,
      roomId,
      dateIn,
      dateOut,
      additionalUsers,
      sendDate
    });

    if (status >= 201) {
      errors.reason = 'Bad Request';
    }

    switch (data.status) {
      case 0:
        errors.success = true;
        break;
      case 1:
        errors.reason = 'Not authenticated';
        break;
      case 2:
        errors.reason = 'Not a conference room';
        break;
      case 3:
        errors.reason = 'Cleaning';
        break;
      default:
        errors.success = true;
        break;
    }

    return [data, errors];
  }

  /**
   * Accept an invite to a reservation
   * @param {string} userEmail - The user's email
   * @param {string} userPassword - The user's password
   * @param {number} roomId - The id of the room reserved
   * @param {Date} dateIn - The start of the reservation
   * @param {Date} dateOut - The end of the reservation
   * @returns {Promise<[Object, Object]>} - Data, error, tuple
   */
  async acceptReservation(userEmail, userPassword, roomId, dateIn, dateOut) {
    const errors = { success: false };
    const { data, status } = await axios.post(URL + '/api/acceptReservation', {
      userEmail,
      userPassword,
      roomId,
      dateIn,
      dateOut
    });

    if (status >= 201) {
      errors.reason = 'Bad Request';
    } else if (data.status && data.status === 1) {
      errors.reason = 'Unauthenticated';
    } else {
      errors.success = true;
    }

    return [data, errors];
  }

  /**
   * Accept an invite to a reservation
   * @param {string} userEmail - The user's email
   * @param {string} userPassword - The user's password
   * @param {number} reservationId - The reservation's id
   * @param {Date} dateIn - The start of the reservation
   * @param {Date} dateOut - The end of the reservation
   * @param {number} roomId - The id of the room reserved
   * @returns {Promise<[Object, Object]>} - Data, error, tuple
   */
  async deleteReservation(userEmail, userPassword, reservationId, dateIn, dateOut, roomId) {
    const errors = { success: false };
    const { data, status } = await axios.delete(URL + '/api/reservation', {
      params: {
        userEmail,
        userPassword,
        reservationId,
        dateOut,
        dateIn,
        roomId
      }
    });

    if (status >= 201) {
      errors.reason = 'Bad Request';
    } else if (data.status && data.status === 1) {
      errors.reason = 'Unauthenticated';
    } else {
      errors.success = true;
    }

    return [data, errors];
  }
}
