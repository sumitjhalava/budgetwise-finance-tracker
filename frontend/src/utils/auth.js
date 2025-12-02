// WARNING: Storing JWT in localStorage is vulnerable to XSS attacks
// Consider using httpOnly cookies for production
// Using sessionStorage as a slightly better alternative to localStorage
export const getToken = () => sessionStorage.getItem('token');
export const setToken = (token) => {
  // Clear any existing token first
  sessionStorage.removeItem('token');
  if (token) {
    sessionStorage.setItem('token', token);
  }
};
export const removeToken = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user'); // Also clear user data
};
export const isAuthenticated = () => !!getToken();