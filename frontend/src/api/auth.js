export const logout = () => {
  sessionStorage.removeItem('user');
};

export const currentUser = () => {
  const user = sessionStorage.getItem('user');
  if (!user) return {};
  console.log('USER', JSON.parse(user));
  return JSON.parse(user);
};

const users = [
  { email: 'walln@smu.edu', password: '123', role: 'employee' },
  { email: 'test@test.com', password: '123', role: 'manager' }
];
