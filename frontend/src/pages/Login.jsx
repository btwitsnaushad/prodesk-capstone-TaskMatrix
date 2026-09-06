import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();

  // Local state for handling form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI states for loading animation and error handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    setServerError(''); // Clear any previous error messages on a fresh attempt

    try {
      // Transmit credentials to the backend for verification
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      console.log("Authentication successful:", response.data.message);
      
      // Securely store the JWT session token in the browser's local storage
      // This token will be attached to future requests to prove the user is logged in
      localStorage.setItem('token', response.data.token);
      
      // Route the authenticated user to their main workspace
      navigate('/dashboard');
      
    } catch (error) {
      // Extract specific backend validation errors (e.g., "Invalid email or password")
      const errorMsg = error.response?.data?.error || "Failed to connect to the server. Please try again.";
      setServerError(errorMsg);
      console.error("Authentication rejected:", errorMsg);
    } finally {
      // Unlock the form regardless of the network outcome
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Login to TaskMatrix
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Welcome back! Please enter your details.
          </p>
        </div>
        
        {/* Conditional rendering for backend error alerts */}
        {serverError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {serverError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (serverError) setServerError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (serverError) setServerError('');
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 font-bold text-white rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Authenticating...' : 'Log In'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-500 hover:underline">
            Register here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;