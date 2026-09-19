import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  
  // State for user info and tasks
  const [userName] = useState(() => localStorage.getItem('userName') || '');
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Retrieve the JWT token securely stored during login
  const token = localStorage.getItem('token');
  
  // NOTE: Replace this with your actual Render API URL if testing on production
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ==========================================
  // 1. FETCH TASKS (Read)
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

    if (token) {
      fetchTasks();
    }
  }, [token, API_URL]);

  // ==========================================
  // 2. CREATE A NEW TASK (POST)
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
      
      // Instantly update the UI by adding the newly created task to the top of the list
      setTasks([response.data.task, ...tasks]);
      setNewTaskTitle(''); // Clear the input field
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // ==========================================
  // 3. DELETE TASK WITH OPTIMISTIC UI (Delete)
  // ==========================================
  const handleDeleteTask = async (taskId) => {
    // OPTIMISTIC UI STEP 1: Save the current state in case the API fails
    const previousTasks = [...tasks];
    
    // OPTIMISTIC UI STEP 2: Instantly remove the item from the screen for a fast user experience
    setTasks(tasks.filter(task => task._id !== taskId));

    try {
      // OPTIMISTIC UI STEP 3: Execute the database deletion silently in the background
      await axios.delete(`${API_URL}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to delete task:', error);
      // REVERT: If the server fails to delete, put the task back on the screen and alert the user
      setTasks(previousTasks);
      alert('Network error. Failed to delete the task.');
    }
  };

  // ==========================================
  // LOGOUT
  // ==========================================
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
            <div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content Area */}
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome to your Workspace, {userName ? userName : 'User'}!
          </h2>
          <p className="text-gray-600 mt-2">Manage your tasks securely below.</p>
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