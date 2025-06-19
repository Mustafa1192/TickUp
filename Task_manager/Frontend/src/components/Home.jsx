import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaskStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTaskStats(response.data);
      } catch (err) {
        console.error('Failed to fetch task stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTaskStats();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-14">Welcome to TickUp</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Your smart way to work better and never miss a deadline.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-500">
          <h3 className="text-gray-500 font-medium">Total Tasks</h3>
          <p className="text-3xl font-bold mt-2">{taskStats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-green-500">
          <h3 className="text-gray-500 font-medium">Completed</h3>
          <p className="text-3xl font-bold mt-2">{taskStats.completed}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-yellow-500">
          <h3 className="text-gray-500 font-medium">Pending</h3>
          <p className="text-3xl font-bold mt-2">{taskStats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-purple-500">
          <h3 className="text-gray-500 font-medium">In Progress</h3>
          <p className="text-3xl font-bold mt-2">{taskStats.inProgress}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Create your first task or explore your existing tasks to manage your workflow efficiently.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/tasks"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition"
            >
              Create New Task
            </Link>
            <Link
              to="/tasks"
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg transition"
            >
              View All Tasks
            </Link>
          </div>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <p className="text-gray-600 mb-6">
            {taskStats.total === 0 ? (
              "You don't have any tasks yet. Create your first task to get started!"
            ) : (
              <>
                You have <span className="font-bold">{taskStats.pending}</span> pending tasks and{' '}
                <span className="font-bold">{taskStats.inProgress}</span> tasks in progress.
              </>
            )}
          </p>
          {taskStats.completed > 0 && (
            <p className="text-green-600">
              Great job! You've completed {taskStats.completed} tasks.
            </p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4">
            <div className="bg-blue-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Task Management</h3>
            <p className="text-gray-600">Create, edit, and organize your tasks with ease.</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-green-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Deadline Tracking</h3>
            <p className="text-gray-600">Never miss important deadlines with our reminder system.</p>
          </div>
          <div className="text-center p-4">
            <div className="bg-purple-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
            <p className="text-gray-600">Your data is encrypted and protected at all times.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;