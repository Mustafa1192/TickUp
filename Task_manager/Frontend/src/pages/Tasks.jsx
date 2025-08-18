import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import {
  FaPlus,
  FaCalendarAlt,
  FaEdit,
  FaTrash,
  FaStar,
  FaRegStar,
} from 'react-icons/fa';

const Tasks = () => {
  const { backendUrl } = useAppContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // --- Modal state ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const userId = localStorage.getItem('userId'); // current logged-in user

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const sortedTasks = [...response.data].sort((a, b) => {
          const dateA = new Date(a.createdAt || a.updatedAt || a.deadline || 0);
          const dateB = new Date(b.createdAt || b.updatedAt || b.deadline || 0);
          return dateB - dateA;
        });

        setTasks(sortedTasks);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [backendUrl]);

  const openDeleteModal = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setTaskToDelete(null);
    setShowDeleteModal(false);
  };

  const handleDelete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${backendUrl}/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks((prev) => prev.filter((task) => task._id !== taskId));
    } catch (err) {
      console.error('Failed to delete task:', err);
    } finally {
      closeDeleteModal();
    }
  };

  // --- Status change (owner + collaborator) ---
  // --- Status change (owner + collaborator) ---
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find(t => t._id === taskId);

      if (!task) {
        console.error('Task not found in local state');
        return;
      }

      const isOwner = task.user.toString() === userId;

      // Use separate endpoint for collaborators
      const endpoint = isOwner
        ? `${backendUrl}/api/tasks/${taskId}`           // Owner: full update
        : `${backendUrl}/api/tasks/${taskId}/status`;  // Collaborator: status only

      const response = await axios.patch(
        endpoint,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update local state safely
      setTasks(prev =>
        prev.map(t => (t._id === taskId ? response.data : t))
      );

    } catch (err) {
      console.error('Update failed:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
    }
  };

  // --- Toggle important (owners only) ---
  const toggleImportant = async (task, e) => {
    if (e && typeof e.stopPropagation === 'function') {
      e.stopPropagation();
      e.preventDefault();
    }

    if (task.user.toString() !== userId) return; // only owner

    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? { ...t, important: !t.important } : t))
    );

    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(
        `${backendUrl}/api/tasks/${task._id}`,
        { important: !task.important },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data : t))
      );
    } catch (err) {
      console.error('Failed to toggle important status:', err);
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? { ...t, important: task.important } : t))
      );
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter !== 'all' && task.status !== filter) return false;
    if (
      searchTerm &&
      !task.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !task.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false;
    return true;
  });

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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 mt-14 gap-4">
        <Link
          to="/tasks/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full shadow-md flex items-center gap-2 transition"
        >
          <FaPlus /> Add New Task
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-lg p-5 rounded-2xl shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search tasks..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filter" className="block text-sm font-semibold text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="filter"
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Showing {filteredTasks.length} of {tasks.length} tasks
        </p>
      </div>

      {/* Task Cards */}
      {filteredTasks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => {
            const isOwner = task.user.toString() === userId;
            const isCollaborator = task.collaborators?.some((c) =>
              c._id ? c._id.toString() === userId : c.toString() === userId
            );

            return (
              <div
                key={task._id}
                className="bg-white/80 backdrop-blur-lg rounded-2xl p-5 shadow-md hover:shadow-lg transition"
              >
                <Link
                  to={`/tasks/${task._id}`}
                  className="block cursor-pointer"
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  {/* Title + Status + Star */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-lg font-bold text-gray-800">{task.title}</h2>
                      {isOwner && (
                        <button
                          onClick={(e) => toggleImportant(task, e)}
                          className="p-1 rounded-full hover:bg-gray-100 transition"
                          title={task.important ? 'Unmark important' : 'Mark important'}
                          aria-label={task.important ? 'Unmark important' : 'Mark important'}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          {task.important ? (
                            <FaStar size={18} className="text-yellow-400" />
                          ) : (
                            <FaRegStar size={18} className="text-gray-400" />
                          )}
                        </button>
                      )}
                    </div>

                    <span
                      className={`px-3 py-1 text-xs rounded-full ${task.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : task.status === 'in-progress'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-3 line-clamp-3">{task.description}</p>

                  {/* Deadline */}
                  {task.deadline && (
                    <div
                      className={`flex items-center text-sm mb-3 ${new Date(task.deadline) < new Date() && task.status !== 'completed'
                        ? 'text-red-500'
                        : 'text-gray-500'
                        }`}
                    >
                      <FaCalendarAlt className="mr-2 text-blue-500 " />
                      Due:{' '}
                      {(() => {
                        const d = new Date(task.deadline);
                        const day = String(d.getDate()).padStart(2, '0');
                        const month = String(d.getMonth() + 1).padStart(2, '0');
                        const year = String(d.getFullYear()).slice(-2);
                        return `${day}/${month}/${year}`;
                      })()}
                      {new Date(task.deadline) < new Date() && task.status !== 'completed' && (
                        <span className="ml-1">(Overdue)</span>
                      )}
                    </div>
                  )}
                </Link>

                {/* Status Change (owner + collaborator) */}
                {(isOwner || isCollaborator) && (
                  <select
                    className="w-full mb-4 px-3 py-2 rounded-full border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                )}

                {/* Actions (owner only) */}
                {isOwner && (
                  <div className="flex justify-between items-center border-t pt-3">
                    <Link
                      to={`/tasks/edit/${task._id}`}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaEdit /> Edit
                    </Link>
                    <button
                      className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(task);
                      }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-8 text-center">
          <h3 className="mt-2 text-lg font-semibold text-gray-800">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {filter === 'all' && searchTerm === ''
              ? "You don't have any tasks yet. Create your first task to get started!"
              : 'No tasks match your current filters. Try adjusting your search or filter criteria.'}
          </p>
          <div className="mt-6">
            <Link
              to="/tasks/new"
              className="px-4 py-2 rounded-full shadow-md text-white bg-blue-600 hover:bg-blue-700 transition"
            >
              Create New Task
            </Link>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && taskToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white rounded-3xl p-8 w-[90%] max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Delete Task</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <span className="font-semibold">{taskToDelete.title}</span>? The task will be moved to the Recycle Bin and can be restored or permanently deleted later.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeDeleteModal}
                className="px-5 py-2 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(taskToDelete._id)}
                className="px-5 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;