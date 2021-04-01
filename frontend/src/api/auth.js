export const login = (email, password) => {
  const errors = {};
  console.log('Looking for user with email:', email);
  const user = users.find((user) => user.email === email);
  console.log('User:', user);

  if (user === undefined) {
    errors.email = 'No user with the provided email';
    return errors;
  } else if (user.password === password) {
    sessionStorage.setItem('user', JSON.stringify({ username: email }));
  } else {
    errors.password = 'Invalid Password.';
    return errors;
  }
  return errors;
};

export const register = (email, password) => {
  const errors = {};
  const user = users.find((user) => user.email === email);
  if (user) {
    errors.email = 'Email already used.';
    return errors;
  } else {
    users.push({ email: email, password: password });
    sessionStorage.setItem('user', JSON.stringify({ username: email }));
  }
  return errors;
};

export const logout = () => {
  sessionStorage.removeItem('user');
};

export const currentUser = () => {
  const user = sessionStorage.getItem('user');
  if (user) return JSON.parse(user);
  return {};
};

const users = [
  { email: 'walln@smu.edu', password: '123' },
  { email: 'test@test.com', password: '123' }
];
