import axios from 'axios';
import { URL } from '../utils/constants';

export class CustodianRepository {
  /**
   * Get all rooms that have not been cleaned
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getRoomsToBeCleaned() {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/getRoomsToBeCleaned');

    if (status >= 201) errors.reason = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Mark a room as cleaned
   * @param {number} roomId - The id of the room that was cleaned
   * @param {Date} lastCleaned - When the room was cleaned
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async markRoomAsCleaned(roomId, lastCleaned = new Date()) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/markRoomAsCleaned', {
      params: {
        roomId,
        lastCleaned
      }
    });

    if (status >= 201) errors.reason = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Get all schedules in a certain month and year
   * @param {number} month - The month to query
   * @param {number} year - The year to query
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getSchedulesDuringMonthAndYear(month, year) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/getSchedulesDuringMonthAndYear', {
      params: {
        month,
        year
      }
    });

    if (status >= 201) errors.reason = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Get all reservations in a certain month and year
   * @param {number} month - The month to query
   * @param {number} year - The year to query
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getReservationsDuringMonthAndYear(month, year) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/getReservationsDuringMonthAndYear', {
      params: {
        month,
        year
      }
    });

    if (status >= 201) errors.reason = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }
}
