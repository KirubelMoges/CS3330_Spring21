import { URL, UserTypes } from "../utils/constants";
import axios from "axios";

export class UserRepository {
  /**
   * Get information about the currently signed in user
   * @returns {Object} - The current user signed in
   */
  currentUser() {
    const user = sessionStorage.getItem("user");
    if (!user) return {};
    return JSON.parse(user);
  }

  /**
   * Determine if a user is currently signed in
   * @returns {bool} - Whether a there is currently a user signed in or not
   */
  loggedIn() {
    return Object.keys(this.currentUser()).length !== 0;
  }

  /**
   * Logout the user and delete session information
   */
  logout() {
    sessionStorage.removeItem("user");
  }

  /**
   * Attempt to login
   * @param {string} email - The email to sign in with
   * @param {string} password - The password to sign in with
   * @returns {Object} - the errors of the login request
   */
  async login(email, password) {
    const errors = {};
    const { data, status } = await axios.get(URL + "/api/login", {
      params: { userEmail: email, userPassword: password },
    });

    if (status > 204) errors.request = "Bad Request";

    switch (data.status) {
      case 1:
        errors.email = "There is no user with this email";
        errors.success = false;
        break;
      case 2:
        errors.password = "Incorrect password";
        errors.success = false;
        break;

      default:
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            username: email,
            role: "employee",
            userId: data.userId,
            officeId: data.officeId ?? null,
            password: password,
            status: data.status ?? 0,
          })
        );
        errors.success = true;
        break;
    }
    return errors;
  }

  /**
   * Attempt to create a new account
   * @param {string} email - The email to register with
   * @param {string} password - The password to register with
   * @param {string} firstName - The first name of the user
   * @param {string} lastName - The last name of the user
   * @param {number} officeId - The office the user is part of
   * @param {string} jobTitle - The user's role
   * @returns {Object} - The errors of the register request
   */
  async register(
    email,
    password,
    firstName,
    lastName,
    officeId,
    jobTitle = UserTypes.employee
  ) {
    const errors = { success: false };

    const { data, status } = await axios.post(URL + "/api/createUser", {
      firstName,
      lastName,
      userEmail: email,
      userPassword: password,
      exposure: false,
      jobTitle,
      officeId,
    });

    if (data.status && data.status === 1) errors.email = "Email already used";

    if (status <= 201) {
      errors.success = true;
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          username: email,
          role: "employee",
          userId: data.data.insertId,
          officeId: officeId,
          password: password,
          status: 0,
        })
      );
    }

    return errors;
  }

  /**
   *
   * @param {number} id - The id of the user to query
   * @returns {Promise<Object>} - The errors of the request
   */
  async getMoreUserInformationById(id) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + "/api/user", {
      params: { userId: id },
    });

    if (status >= 201) errors.request = "Bad Request";
    else {
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          ...this.currentUser(),
          jobTitle: data.data[0].jobTitle,
          officeId: data.data[0].officeId,
          reportsTo: data.data[0].reportsTo,
          exposure: data.data[0].exposure,
          covidStatus: data.data[0].covidStatus,
          scheduleId: data.data[0].scheduleId,
        })
      );
      errors.success = true;
    }
    return errors;
  }

  /**
   * Get information about a user
   * @param {number} id - The id of the user to get
   * @returns {[Object, Object]} - Data, error tuple
   */
  async getUserById(id) {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + "/api/user", {
      params: { userId: id },
    });

    if (status >= 201) errors.request = "Bad Request";
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Get an array of all users
   * @returns {[Object, Object]} - Data, error tuple
   */
  async getAllUsers() {
    const errors = { success: false };
    const { data, status } = await axios.get(URL + "/getAllUsers", {});

    if (status >= 201) errors.request = "Bad Request";
    else errors.success = true;

    return [data, errors];
  }

  /**
   * Change the user status of a given user
   * @param {number} id - The id of the user to get
   * @param {number} covidStatus - The id of the user to get
   * @returns {[Object, Object]} - Data, error tuple
   */

  async editCovidStatus(id, covidStatus) {
    const errors = { success: false };
    const { id, covidStatus } = await axios.put(URL + "/editCovidStatus", {});

    if (status >= 201) errors.request = "Bad Request";
    else errors.success = true;

    return errors;
  }
}
