import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if the JWT session token exists in the browser's local storage
  const token = localStorage.getItem('token');

  // If a token is present, render the protected component (children).
  // Otherwise, immediately redirect the unauthenticated user to the login page.
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;