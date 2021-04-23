import axios from 'axios';
import { URL } from '../utils/constants';

export class OfficeRepo {
  /**
   * Get information about a specific office
   * @param {number} officeId - The id of the office to get
   * @returns {[Object, Object]} - Data, error tuple
   */
  async getOffice(officeId) {
    const errors = { sucess: false };
    const { data, status } = await axios.get(URL + '/api/office', {
      params: { officeId: officeId }
    });

    if (status >= 201) {
      console.log(data);
      errors.reason = 'Bad Request';
    } else errors.sucess = true;

    return [data.data[0], errors];
  }

  /**
   * Create a new office
   * @param {string} city - The city where the office will be located
   * @param {string} state - The state where the office will be located
   * @param {number} countryCode - The country code of the country where the office will be located
   * @returns {[Object, Object]} - Data, error tuple
   */
  async createOffice(city, state, countryCode = 840) {
    const errors = { success: false };
    const { data, status } = await axios.post(URL + '/api/createOffice', {
      city,
      state,
      countryCode
    });

    if (status >= 201) {
      console.log(data);
      errors.request = 'Bad Request';
    } else errors.success = true;

    return [data.data[0], errors];
  }

  /**
   * Gets all offices in the database
   * @returns {[Object, Object]} - Data, errors tuple
   */
  async getOffices() {
    const errors = { sucess: false };
    const { data, status } = await axios.get(URL + '/api/offices');

    if (status >= 201) {
      console.log(data);
      errors.reason = 'Bad Request';
    } else errors.sucess = true;

    return [data, errors];
  }
}
