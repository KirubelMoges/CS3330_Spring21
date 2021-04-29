import axios from 'axios';
import { URL } from '../utils/constants';

export class RoomsRepository {
  /**
   * Get all rooms in the user's office
   * @param {string} email - The email of the user looking for rooms
   * @param {string} password - The password of the user looking for rooms
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getRooms(email, password) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/rooms', {
      params: { userEmail: email, userPassword: password }
    });

    if (status >= 201) {
      errors.reason = 'Bad Request';
    } else if (data.status && data.status === '1') {
      errors.reason = 'Not authenticated';
    } else {
      errors.success = true;
    }

    return [data, errors];
  }

  /**
   * Attempt to create a new room
   * @param {string} name - The email of the manager creating aroom
   * @param {string} capacity - The password of the manager creating a room
   * @param {number} officeId - The id of the office for room to create
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async createRoom(
    name,
    capacity = 50,
    officeId = 1,
    lastCleaned = null,
    availability = 1,
    cleaned = 1
  ) {
    const errors = { success: false };
    const { data, status } = await axios.post(
      URL + '/api/manager/room',
      {},
      { params: { name, capacity, lastCleaned, availability, cleaned, officeId } }
    );

    if (status >= 201) {
      errors.reason = 'Bad Request';
    } else {
      errors.success = true;
    }
    return [data, errors];
  }

  /**
   * Get all available conference rooms
   * @param {string} userEmail - The user's email
   * @param {string} userPassword - The user's password
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getAvailableConferenceRooms(userEmail, userPassword) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/availableConferenceRoom', {
      params: {
        userEmail,
        userPassword
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

  /**
   * Get available conference rooms with a certain capacity
   * @param {string} userEmail - The user's email
   * @param {string} userPassword - The user's password
   * @param {number} capacity - The room's capacity
   * @param {Date} dateTime - The time to look for availability
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async getAvailableConferenceRoomsGivenCapacity(
    userEmail,
    userPassword,
    capacity,
    dateTime = new Date()
  ) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/availableConferencesGivenCapacity', {
      params: {
        userEmail,
        userPassword,
        capacity,
        dateTime
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
