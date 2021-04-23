import axios from 'axios';
import { URL, UserTypes } from '../utils/constants';

export class EmployeeRepository {
  /**
   * Get reservations for a certain month and year
   * @param {number} month - The month
   * @param {number} year - The year
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getReservations(month, year) {
    const errors = { success: false };
    const { data, status } = await axios.get(
      URL + '/api/employee/getReservationsDuringMonthAndYear',
      { params: { month: month, year: year } }
    );

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Get schedules for a certain month and year
   * @param {number} month - The month
   * @param {*} year - The year
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getSchedules(month, year) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/employee/getSchedulesDuringMonthAndYear', {
      params: { month: month, year: year }
    });

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   *
   * @param {number} roomId - The id of the room to reserve
   * @param {DateTime} dateIn - The start date
   * @param {DateTime} dateOut - The end date
   * @param {number} userId - The reserver's room
   * @param {string} creatorType - The reserver's role
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async createReservation(roomId, dateIn, dateOut, userId, creatorType = UserTypes.employee) {
    const errors = { success: false };
    const { data, status } = await axios.post(
      URL + '/api/employee/reservation',
      {},
      { params: { roomId, dateIn, dateOut, userId, creatorType } }
    );

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Delete a reservation
   * @param {number} reservationId - The id of the reservation
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async deleteReservation(reservationId) {
    const errors = { success: false };
    const { data, status } = await axios.delete(URL + '/api/employee/reservation', {
      params: { reservationId: reservationId }
    });

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Report contact with another person
   * @param {number} firstId - The id of the first person
   * @param {number} secondId - The id of the second person
   * @param {string} comment - Comments about the incident
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async reportContact(firstId, secondId, comment) {
    const errors = { success: false };
    const { data, status } = await axios.post(URL + '/api/employee/covidContact', {
      userIdA: firstId,
      userIdB: secondId,
      secondId,
      comment: comment
    });

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Get all people who have come in contact with a person
   * @param {number} userId - The id of the person to get their contact information
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getContacts(userId) {
    const errors = { success: false };
    const { data, status } = await axios.get(
      URL + '/api/employee/getAllPeopleInContactWithUserId',
      {
        params: { userId: userId }
      }
    );

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }
}
