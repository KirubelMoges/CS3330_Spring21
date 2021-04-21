import axios from 'axios';
import { URL } from '../utils/constants';

export class MessageRepository {
  /**
   *
   * @returns {[Object, Object]} - Data, error tuple
   */
  async getManagerMessages() {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/messages');

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   *
   * @returns {[Object, Object]} - Data, error tuple
   */
  async getAllEmployeeMessages() {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + '/api/allMessages');

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Get a user's inbox
   * @param {number} userId - The id of the user who is requesting their inbox
   * @returns {[Object, Object]} - Data, error tuple
   */
  async getAllRecievedEmployeeMessages(userId) {
    const errors = { success: false };
    const { data, status } = await axios({
      url: URL + '/api/EmployeeMessages',
      data: { recipientID: userId }
    });

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Search messages for a given phrase
   * @param {string} keyword - The keyword to search by
   * @returns {[Object, Object]} - Data, error tuple
   */
  async searchMessages(keyword) {
    const errors = { success: false };
    const { data, status } = await axios({
      url: URL + '/api/searchMessages',
      data: { keyword }
    });

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Send a message to another user
   * @param {number} senderId - The sender's id
   * @param {number} recieverId - The recipient's id
   * @param {string} subject - The message subject
   * @param {DateTime} sendDate - The time the message was sent at
   * @param {string} message - The content of the message
   * @returns {[Object, Object]} - Data, error tuple
   */
  async sendMessage(senderId, recieverId, subject, sendDate, message) {
    const errors = { success: false };
    const { data, status } = await axios.post(URL + '/api/postMessage', {
      senderId,
      recieverId,
      sendDate,
      subject,
      message
    });

    if (status >= 201) errors.request = 'Bad Request';
    else errors.success = true;

    return [data, errors];
  }
}
