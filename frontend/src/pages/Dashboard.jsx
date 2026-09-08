import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // Fix: Removed 'setUserName' since we only need to read the name, not update it.
  const [userName] = useState(() => localStorage.getItem('userName') || '');

  const handleLogout = () => {
    // Security Step: Remove ALL authentication data from the browser
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    
    // Redirect the user back to the login page immediately
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="shrink-0 flex items-center">
              <h1 className="text-2xl font-extrabold text-blue-600">TaskMatrix</h1>
            </div>
            <div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content Area */}
      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex flex-col items-center justify-center">
            {/* Display the personalized greeting */}
            <h2 className="text-3xl font-bold text-gray-700 mb-2">
              Welcome to your Workspace, {userName ? userName : 'User'}!
            </h2>
            <p className="text-gray-500">Your dashboard is fully secured. Only logged-in users can see this.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;