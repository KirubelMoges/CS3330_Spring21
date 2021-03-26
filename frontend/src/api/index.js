import { currentUser, login, logout, register } from './auth';

export const api = {
  login: login,
  register: register,
  logout: logout,
  currentUser: currentUser
};
