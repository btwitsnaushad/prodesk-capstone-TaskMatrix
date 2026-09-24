import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [userName] = useState(() => localStorage.getItem('userName') || '');
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // ✨ NEW: States for AI Suggestions
  const [subtasks, setSubtasks] = useState([]);
  const [isAILoading, setIsAILoading] = useState(false);
  
  // States for Editing Mode
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState('');

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // ==========================================
  // CHECK PAYMENT STATUS ON LOAD
  // ==========================================
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      alert('Payment successful! 🎉 Welcome to TaskMatrix Pro!');
    }
    if (query.get('canceled')) {
      alert('Payment canceled. You can upgrade anytime!');
    }
  }, []);

  // ==========================================
  // FETCH TASKS (READ)
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
      const response = await axios.post(
        `${API_URL}/api/payment/create-checkout-session`,
        {}, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('Unable to start payment process. Please try again.');
    }
  };

  // ==========================================
  // ✨ NEW: AI SUGGEST SUBTASKS
  // ==========================================
  const handleAISuggest = async () => {
    if (!newTaskTitle.trim()) {
      alert("Please enter a task title first!");
      return;
    }

    setIsAILoading(true);
    setSubtasks([]); // Clear previous suggestions

    try {
      const response = await axios.post(
        `${API_URL}/api/ai/suggest`,
        { taskTitle: newTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubtasks(response.data.subtasks);
    } catch (error) {
      console.error('Failed to get AI suggestions:', error);
      alert('AI service is currently unavailable.');
    } finally {
      setIsAILoading(false);
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
      setSubtasks([]); // ✨ Clear AI suggestions after task is created
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  // ==========================================
  // UPDATE TASK
  // ==========================================
  const handleUpdateTask = async (e, taskId) => {
    e.preventDefault();
    if (!editTaskTitle.trim()) return;

    try {
      const response = await axios.put(
        `${API_URL}/api/tasks/${taskId}`,
        { title: editTaskTitle },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, title: response.data.task.title || editTaskTitle } : task
      ));
      
      setEditingTaskId(null);
      setEditTaskTitle('');
    } catch (error) {
      console.error('Failed to update task:', error);
      alert(error.response?.status === 403 ? "Forbidden: You don't own this task." : 'Failed to update task.');
    }
  };

  const startEditing = (task) => {
    setEditingTaskId(task._id);
    setEditTaskTitle(task.title);
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
      alert(error.response?.status === 403 ? "Forbidden: You don't own this task." : 'Network error. Failed to delete the task.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="shrink-0 flex items-center">
              <h1 className="text-2xl font-extrabold text-blue-600">TaskMatrix</h1>
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleUpgradeToPro}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-bold shadow-md transition-colors"
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
            {/* ✨ NEW: AI Suggest Button */}
            <button
              type="button"
              onClick={handleAISuggest}
              disabled={isAILoading}
              className="px-4 py-2 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isAILoading ? "✨ Thinking..." : "✨ AI Suggest"}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Task
            </button>
          </form>

          {/* ✨ NEW: AI Results Display */}
          {subtasks.length > 0 && (
            <div className="mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md animate-fade-in-down">
              <h4 className="font-bold mb-2 text-purple-800">✨ AI Suggested Subtasks:</h4>
              <ul className="list-disc pl-5 space-y-1 text-purple-700">
                {subtasks.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>
            </div>
          )}
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
                  
                  {editingTaskId === task._id ? (
                    <form onSubmit={(e) => handleUpdateTask(e, task._id)} className="flex flex-1 gap-4 mr-4">
                      <input
                        type="text"
                        value={editTaskTitle}
                        onChange={(e) => setEditTaskTitle(e.target.value)}
                        className="flex-1 px-3 py-1 border border-blue-400 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        required
                      />
                      <button type="submit" className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700">Save</button>
                      <button type="button" onClick={() => setEditingTaskId(null)} className="px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
                    </form>
                  ) : (
                    <>
                      <span className="text-gray-800 text-lg font-medium truncate flex-1">{task.title}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditing(task)}
                          className="px-4 py-1.5 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task._id)}
                          className="px-4 py-1.5 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
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