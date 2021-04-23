import axios from 'axios';
import { URL } from '../utils/constants';

export class ClockRepository {
  /**
   * Attempt to get a user's clocking information
   * @param {string} userEmail - The email of a user requesting their clock data
   * @param {string} userPassword - The password of a user requesting their clock data
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getClockData(userEmail, userPassword) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/clockData', {
      params: { userEmail, userPassword }
    });

    if (status >= 201) {
      console.log(data);
      errors.request = 'Bad Request';
    } else if (data.status === 1) {
      errors.reason = 'Still clocked in, clock out before clocking in.';
    } else errors.success = true;

    return [data.data, errors];
  }

  /**
   * Attempt to clock in for a given user
   * @param {number} userId - The id of the user attempting to clock in
   * @param {DateTime} time - The current time for the user attempting to clock in
   * @param {number} roomId - The id of the room the user is assigned
   * @param {string} clockInType - The type of the clock in the user is attempting
   * @returns {[Object, Object]} - Data, error tuple
   */
  async clockIn(userId, time, roomId, clockInType = '') {
    const errors = { success: false };
    const { data, status } = await axios.post(URL + '/api/clockin', {
      userId,
      roomId,
      clockIn: new Date(time),
      clockInType
    });

    if (status >= 201) {
      console.log(data);
      errors.request = 'Bad Request';
    } else if (data.status === 1) {
      errors.reason = 'Still clocked in, clock out before clocking in.';
    } else errors.success = true;

    return [data, errors];
  }

  /**
   * Attempt to clock out of work for a given user
   * @param {number} userId - The id of the user clocking out
   * @param {DateTime} time - The time the user is clocking out at
   * @param {number} roomId - The id of the room the user is clocking out of
   * @param {string} clockInType - The type of the clock out
   * @returns {[Object, Object]} - Data, error tuple
   */
  async clockOut(userId, time, roomId, clockInType = '') {
    const errors = { success: false };
    const { data, status } = await axios.put(URL + '/api/clockout', {
      userId,
      roomId,
      clockIn: time,
      clockInType
    });

    if (status >= 201) {
      console.log(data);
      errors.request = 'Bad Request';
    } else if (data.status === 1) {
      errors.reason = 'Still clocked out, clock in before clocking out.';
    } else errors.success = true;

    return [data, errors];
  }

  /**
   * Request to change a user's scheduled hours, sends a message to a manager
   * @param {string} userEmail - The email of the user requesting to change their times
   * @param {number} clockId - The id of the user's clock schedule
   * @param {DateTime} newClockInTime - The requested new schedule start
   * @param {DateTime} newClockOutTime - The requested new schedule end
   * @param {string} newClockInType - The new start type
   * @param {string} newClockOutType - The new end type
   * @param {DateTime} sendDate - The timestamp of the request
   * @returns {Promise<Object>} - The errors and status of the request
   */
  async requestClockChange(
    userEmail,
    clockId,
    newClockInTime,
    newClockOutTime,
    newClockInType,
    newClockOutType,
    sendDate
  ) {
    const errors = { success: false };
    const { data, status } = await axios.post(
      URL + '/api/requestClockChange',
      {
        userEmail,

        newClockIn: newClockInTime,
        newClockOut: newClockOutTime,
        newClockInType,
        newClockOutType,
        sendDate
      },
      {
        params: {
          clockId: clockId
        }
      }
    );

    if (status >= 201) {
      console.log(data);
      errors.request = 'Bad Request';
    } else if (data.status === 2) {
      errors.reason = 'User does not have a boss';
    } else errors.success = true;

    return errors;
  }

  /**
   * Attempt to get all of the clock change requests of a given user
   * @param {number} userId - The id of the user
   * @param {string} userPassword - The password of the user
   * @returns {[Object, Object]} - Data, Error tuple
   */
  async clockRequests(userId, userPassword) {
    const errors = { success: false };
    const { data, status } = await axios({
      method: 'GET',
      data: {
        userId,
        userPassword
      },
      url: URL + '/api/clockRequests'
    });

    if (status >= 200) {
      console.log(data);
      errors.request = 'Bad Request';
    } else errors.success = true;

    return [data, errors];
  }

  /**
   * Attempt to query for available rooms with a certain capacity or more
   * @param {string} userEmail - The email of the user attempting to query the available rooms
   * @param {string} userPassword - The password of the user attempting to query the available rooms
   * @param {number} capacity - The capacity to filter by
   * @returns {[Object, Object]} - Data, error, tuple
   */
  async availableGivenCapacity(userEmail, userPassword, capacity) {
    const errors = { success: false };
    const { data, status } = await axios({
      method: 'GET',
      data: {
        userEmail,
        userPassword,
        capacity
      },
      url: URL + '/api/availableRegularGivenCapacity'
    });

    if (status >= 200) {
      console.log(data);
      errors.request = 'Bad Request';
    } else if (data.status === 1) errors.reason = 'Incorrect credentials';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Attempt to query all available rooms regardless of capacity
   * @param {string} userEmail - The email of the user attempting to query the available rooms
   * @param {string} userPassword - The password of the user attempting to query the available rooms
   * @returns {[Object, Object]} - Date, error tuple
   */
  async availableRegularRooms(userEmail, userPassword) {
    const errors = { success: false };
    const { data, status } = await axios({
      method: 'GET',
      data: {
        userEmail,
        userPassword
      },
      url: URL + '/api/availableRegularRoom'
    });

    if (status >= 200) {
      console.log(data);
      errors.request = 'Bad Request';
    } else if (data.status === 1) errors.reason = 'Incorrect credentials';
    else errors.success = true;

    return [data, errors];
  }
}
