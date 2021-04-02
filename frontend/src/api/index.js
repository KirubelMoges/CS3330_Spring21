import { currentUser, login, logout, register } from './auth';
import { getOffices } from './offices';

export const api = {
  login: login,
  register: register,
  logout: logout,
  currentUser: currentUser,
  getOffices: getOffices
};
