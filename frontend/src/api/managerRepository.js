import axios from 'axios';
import { URL } from '../utils/constants';

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
      URL + '/api/manager/addReservation',
      {},
      {
        params: {
          roomId,
          dateIn,
          dateOut,
          userId
        }
      }
    );

    if (status >= 201) errors.reason = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }
}
