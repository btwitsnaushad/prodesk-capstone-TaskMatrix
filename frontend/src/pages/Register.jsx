import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate(); 

  // We maintain a single state object to capture user inputs cleanly.
  // Using 'username' here to keep the UI simple, which we will map to backend requirements later.
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState(''); 

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear any lingering error messages the moment the user starts typing again
    if (serverError) setServerError('');
  };

  const handleRegistration = async (e) => {
    e.preventDefault(); 
    setIsSubmitting(true);
    setServerError('');

    try {
      // Constructing a comprehensive payload to bridge the gap between UI and backend constraints.
      // Mapping 'username' to both fields satisfies API validation (name) and MongoDB indexes (username).
      const apiPayload = {
        name: formData.username,      
        username: formData.username,  
        email: formData.email,
        password: formData.password
      };

      // Transmit the mapped payload to the authentication endpoint
      const response = await axios.post('http://localhost:5000/api/auth/register', apiPayload);
      
      console.log("Registration successful:", response.data);
      
      // Route the user to the login view upon successful account creation
      navigate('/login');
      
    } catch (error) {
      // Safely extract nested backend validation errors, falling back to a generic message if the network fails
      const backendError = error.response?.data?.message || error.response?.data?.error;
      const errorMsg = backendError || "Failed to process registration. Please verify your details and try again.";
      
      setServerError(errorMsg);
      console.error("Registration payload rejected:", error.response?.data || error.message);
    } finally {
      // Ensure the form unlocks regardless of success or failure
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-sm border border-gray-100">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Join TaskMatrix
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Create your account to start organizing your sprints
          </p>
        </div>
        
        {serverError && (
          <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
            {serverError}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleRegistration}>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., johndoe123"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Work Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="you@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Secure Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="••••••••"
              minLength="6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full px-4 py-2 text-white font-bold rounded-md transition-colors ${
              isSubmitting 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-500 hover:underline">
            Log in here
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Register;