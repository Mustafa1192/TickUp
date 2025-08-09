import { useRef, useState } from "react"; // make sure to import useState and useRef
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt, FaUserPlus, FaPlus, FaPaperPlane } from 'react-icons/fa';

const CreateTask = () => {
  const { backendUrl } = useAppContext();
  const datePickerRef = useRef(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [deadline, setDeadline] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [inviteInput, setInviteInput] = useState('');
  const [showSend, setShowSend] = useState(false);

  const navigate = useNavigate();

  const handleAddCollaborator = () => {
    if (
      inviteInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) &&
      !collaborators.includes(inviteInput.trim())
    ) {
      setCollaborators([...collaborators, inviteInput.trim()]);
      setInviteInput('');
      setShowSend(true);
    }
  };

  const handleSendInvites = () => {
    alert('Invites sent!');
    setShowSend(false);
  };

  const removeCollaborator = (email) => {
    setCollaborators(collaborators.filter((c) => c !== email));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${backendUrl}/api/tasks`,
        {
          title,
          description,
          status,
          deadline,
          collaborators,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate('/tasks');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] px-4">
      <div className="w-full max-w-xl bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Task</h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Task Title
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

          {/* Collaborators + Deadline */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            {/* Collaborators */}
            <div className="sm:w-1/2 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Collaborators</label>
              <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition">
                <FaUserPlus className="mr-2 text-blue-500" />
                <input
                  type="text"
                  placeholder="Add by email"
                  value={inviteInput}
                  onChange={(e) => setInviteInput(e.target.value)}
                  className="bg-transparent outline-none flex-1 text-gray-800 placeholder-gray-500"
                />
                {inviteInput.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/) && !showSend && (
                  <button
                    type="button"
                    onClick={handleAddCollaborator}
                    className="text-blue-600 hover:text-blue-800 transition"
                    title="Add Collaborator"
                  >
                    <FaPlus />
                  </button>
                )}
                {showSend && (
                  <button
                    type="button"
                    onClick={handleSendInvites}
                    className="text-green-500 hover:text-green-700 transition"
                    title="Send Invites"
                  >
                    <FaPaperPlane />
                  </button>
                )}
              </div>
              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {collaborators.map((person, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-2 pl-3 pr-2 py-1 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full text-xs shadow-sm"
                  >
                    {person}
                    <button
                      type="button"
                      onClick={() => removeCollaborator(person)}
                      className="ml-1 text-white/80 hover:text-yellow-200 transition"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div className="sm:w-1/2 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>

              <div
                onClick={() => setIsDatePickerOpen(true)}
                className="flex items-center px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 border border-gray-200 focus-within:ring-2 focus-within:ring-blue-400 transition cursor-pointer"
              >
                <FaCalendarAlt className="mr-2 text-blue-500" />
                <DatePicker
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

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition text-sm shadow-sm"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
