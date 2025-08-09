import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';

const EditTask = () => {
  const { backendUrl } = useAppContext();
  const datePickerRef = useRef(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [deadline, setDeadline] = useState(null); // Date object
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${backendUrl}/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTitle(response.data.title || '');
        setDescription(response.data.description || '');
        setStatus(response.data.status || 'pending');
        setDeadline(response.data.deadline ? new Date(response.data.deadline) : null);
      } catch (err) {
        console.error('Failed to fetch task:', err);
      }
    };
    fetchTask();
  }, [id, backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${backendUrl}/api/tasks/${id}`,
        {
          title,
          description,
          status,
          deadline, // will send date or null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/tasks');
    } catch (err) {
      console.error('Failed to update task:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Task</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
              placeholder="Enter task title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm resize-none"
              placeholder="Enter task description"
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-1">
              <FaCalendarAlt className="text-blue-500" /> Deadline
            </label>

            <div
              onClick={() => setIsDatePickerOpen(true)}
              className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition cursor-pointer"
            >
              <DatePicker
                ref={datePickerRef}
                selected={deadline}
                onChange={(date) => {
                  setDeadline(date);
                  setIsDatePickerOpen(false);
                }}
                placeholderText="No deadline"
                className="bg-transparent focus:outline-none w-full cursor-pointer"
                dateFormat="MMM d, yyyy"
                open={isDatePickerOpen}
                onClickOutside={() => setIsDatePickerOpen(false)}
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-sm"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition text-sm shadow-sm"
          >
            Update Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTask;
