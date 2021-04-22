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
   * @param {string} userEmail - The email of the manager creating aroom
   * @param {string} userPassword - The password of the manager creating a room
   * @param {number} roomId - The id of the room to create
   * @param {string} roomType - The type of room
   * @param {number} capacity - The max occupancy of the room
   * @param {number} availability - Is the room available or nott
   * @param {number} cleaned - Whether the room is cleaned or not
   * @param {number} beingCleaned - Wheter the room is being cleaned at the moment or not
   * @returns {Promise<[Object, Object]>} - Data, error tuple
   */
  async createRoom(
    userEmail,
    userPassword,
    roomId,
    roomType,
    capacity,
    availability,
    cleaned,
    beingCleaned
  ) {
    const errors = { success: false };
    const { data, status } = await axios.post(URL + '/api/rooms', {
      userEmail,
      userPassword,
      roomId,
      roomType,
      capacity,
      availability,
      cleaned,
      beingCleaned
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
