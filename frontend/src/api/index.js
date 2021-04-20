import { currentUser, login, logout, register } from './auth';
import { getOffices } from './offices';

export const api = {
  logout: logout,
  currentUser: currentUser,
  getOffices: getOffices
};
