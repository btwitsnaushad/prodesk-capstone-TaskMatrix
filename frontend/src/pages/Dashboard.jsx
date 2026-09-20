import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [userName] = useState(() => localStorage.getItem('userName') || '');
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ==========================================
  // CHECK PAYMENT STATUS ON LOAD
  // ==========================================
  useEffect(() => {
    // Check the URL for Stripe success or cancel messages
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      alert('Payment successful! 🎉 Welcome to TaskMatrix Pro!');
    }
    if (query.get('canceled')) {
      alert('Payment canceled. You can upgrade anytime!');
    }
  }, []);

  // ==========================================
  // FETCH TASKS
  // ==========================================
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data.tasks);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    if (token) fetchTasks();
  }, [token, API_URL]);

  // ==========================================
  // STRIPE PAYMENT INTEGRATION
  // ==========================================
  const handleUpgradeToPro = async () => {
    try {
      // 1. Call our secure Node.js backend to create a Stripe checkout session
      const response = await axios.post(
        `${API_URL}/api/payment/create-checkout-session`,
        {}, // No body needed
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // 2. Redirect the user securely to the Stripe payment page
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Unable to start payment process. Please try again.');
    }
  };

  // ==========================================
  // CREATE TASK
  // ==========================================
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/api/tasks`,
        { title: newTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks([response.data.task, ...tasks]);
      setNewTaskTitle('');
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // ==========================================
  // DELETE TASK (OPTIMISTIC UI)
  // ==========================================
  const handleDeleteTask = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks(tasks.filter(task => task._id !== taskId));

    try {
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      setTasks(previousTasks);
      alert('Network error. Failed to delete the task.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
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
            <div className="flex gap-4">
              <button
                onClick={handleUpgradeToPro}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-sm transition-all"
              >
                ⭐ Upgrade to Pro
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content Area */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome to your Workspace, {userName ? userName : 'User'}!
            </h2>
            <p className="text-gray-600 mt-2">Manage your tasks securely below.</p>
          </div>
        </div>

        {/* Task Creation Form */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <form onSubmit={handleCreateTask} className="flex gap-4">
            <input
              type="text"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
          </form>
        </div>

        {/* Tasks List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {tasks.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No tasks found. Create one to get started!
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task) => (
                <li key={task._id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <span className="text-gray-800 text-lg font-medium">{task.title}</span>
                  <button
                    onClick={() => handleDeleteTask(task._id)}
                    className="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;