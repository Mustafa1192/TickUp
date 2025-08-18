import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAppContext } from '../Context/AppContext';
import axios from 'axios';
import { ClipboardList, CheckCircle, Clock, Loader, ShieldCheck } from 'lucide-react';

const Home = () => {
  const { backendUrl } = useAppContext();
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
        const response = await axios.get(`${backendUrl}/api/tasks/stats`, {
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

  const stats = [
    { label: 'Total Tasks', value: taskStats.total, color: 'blue', icon: ClipboardList },
    { label: 'Completed', value: taskStats.completed, color: 'green', icon: CheckCircle },
    { label: 'Pending', value: taskStats.pending, color: 'yellow', icon: Clock },
    { label: 'In Progress', value: taskStats.inProgress, color: 'purple', icon: Loader }
  ];

  const features = [
    {
      icon: ClipboardList,
      title: 'Task Management',
      description: 'Create, edit, and organize your tasks with our intuitive interface.'
    },
    {
      icon: Clock,
      title: 'Deadline Tracking',
      description: 'Smart reminders ensure you never miss important deadlines.'
    },
    {
      icon: ShieldCheck,
      title: 'Secure & Private',
      description: 'Enterprise-grade security protects your data at all times.'
    }
  ];

  if (loading) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 z-50 gap-4">
        <svg
          className="animate-spin h-14 w-14 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
        <p className="text-blue-700 font-semibold text-lg select-none">
          Syncing your TickUp data…
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#1e293b] mb-4 mt-14">
            Welcome to <span className="text-[#3b82f6]">TickUp</span>
          </h1>
          <p className="text-xl text-[#475569] max-w-2xl mx-auto">
            Your smart way to work better and never miss a deadline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map(({ label, value, color, icon: Icon }, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl active:scale-105 active:shadow-xl">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${color}-100 mr-4`}>
                  <Icon className={`w-6 h-6 text-${color}-600`} />
                </div>
                <div>
                  <h3 className="text-[#64748b] font-medium">{label}</h3>
                  <p className={`text-3xl font-bold mt-1 text-${color}-600`}>{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Get Started</h2>
              <p className="text-[#475569] mb-8">
                Create your first task or explore your existing tasks to manage your workflow efficiently.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/tasks/new"
                  className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-center font-medium"
                >
                  Create New Task
                </Link>
                <Link
                  to="/tasks"
                  className="bg-white border-2 border-[#cbd5e1] hover:border-[#93c5fd] active:border-[#60a5fa] text-[#1e293b] px-8 py-4 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md active:shadow-md hover:scale-105 active:scale-105 text-center font-medium"
                >
                  View All Tasks
                </Link>
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold text-[#1e293b] mb-6">Your Progress</h2>
              {taskStats.total === 0 ? (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 text-center">
                  <p className="text-blue-800">
                    You don't have any tasks yet. Create your first task to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-[#f1f5f9] rounded-xl p-6">
                    <p className="text-[#334155] mb-4">
                      You have <span className="font-bold text-[#1e293b]">{taskStats.pending}</span> pending tasks and{' '}
                      <span className="font-bold text-[#1e293b]">{taskStats.inProgress}</span> tasks in progress.
                    </p>
                    <div className="mb-2 flex justify-between text-sm text-[#64748b]">
                      <span>Completion Rate</span>
                      <span>{Math.round((taskStats.completed / taskStats.total) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-[#6366f1] to-[#3b82f6] h-2.5 rounded-full"
                        style={{ width: `${(taskStats.completed / taskStats.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {taskStats.completed > 0 && (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6">
                      <p className="text-green-800 font-medium">
                        🎉 Great job! You've completed {taskStats.completed} tasks.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-[#1e293b] mb-8">Key Features</h2>
            <div className="space-y-8">
              {features.map(({ icon: Icon, title, description }, i) => (
                <div key={i} className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-lg mr-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#1e293b] mb-2">{title}</h3>
                    <p className="text-[#475569]">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {localStorage.getItem('token') ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 py-16 px-4 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              Manage Tasks,<br />Master Time!
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-gray-800">
              <span className="text-red-500 text-xl">🔥</span> Master your minutes, conquer your goals – <strong className="text-gray-900">TickUp by Musk</strong>
            </p>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-[#6366f1] to-[#3b82f6] rounded-2xl p-12 text-center shadow-xl">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to boost your productivity?</h2>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of professionals who use TickUp to manage their tasks efficiently.
            </p>
            <Link
              to="/tasks/new"
              className="inline-block bg-white hover:bg-gray-100 text-[#3b82f6] px-10 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl font-medium text-lg"
            >
              Get Started Now
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default Home;
