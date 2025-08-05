import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';

const CreateTask = () => {
  const { backendUrl } = useAppContext();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${backendUrl}/api/tasks`, {
        title,
        description,
        status,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/tasks');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] px-4">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Create Task
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;








// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAppContext } from '../Context/AppContext';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';
// import { FaUser, FaCalendarAlt } from 'react-icons/fa';

// const CreateTask = () => {
//   const { backendUrl } = useAppContext();
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('pending');
//   const [deadline, setDeadline] = useState(null);
//   const [assignee, setAssignee] = useState('Mustafa Khan'); // Current user
//   const [inviteEmail, setInviteEmail] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(`${backendUrl}/api/tasks`, {
//         title,
//         description,
//         status,
//         deadline,
//         assignee,
//       }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       navigate('/tasks');
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] px-4">
//       <div className="w-full max-w-xl bg-white/70 backdrop-blur-lg shadow-xl rounded-2xl p-8">
//         <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
//           Create Task
//         </h1>

//         {/* ASSIGNEE + DEADLINE */}
//         <div className="flex justify-between items-center mb-6 space-x-4">
//           <div className="flex items-center space-x-2">
//             <FaUser className="text-gray-500" />
//             <span className="text-gray-800 font-medium">{assignee}</span>
//           </div>
//           <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-full space-x-2">
//             <FaCalendarAlt className="text-blue-600" />
//             <DatePicker
//               selected={deadline}
//               onChange={(date) => setDeadline(date)}
//               placeholderText="No deadline"
//               className="bg-transparent focus:outline-none text-gray-700"
//               dateFormat="MMM d, yyyy"
//             />
//           </div>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
//               Task Title
//             </label>
//             <input
//               type="text"
//               id="title"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//               placeholder="Enter task title"
//             />
//           </div>

//           <div>
//             <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
//               Description
//             </label>
//             <textarea
//               id="description"
//               rows="4"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//               placeholder="Enter task description"
//             />
//           </div>

//           <div>
//             <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">
//               Status
//             </label>
//             <select
//               id="status"
//               value={status}
//               onChange={(e) => setStatus(e.target.value)}
//               className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition"
//             >
//               <option value="pending">Pending</option>
//               <option value="in-progress">In Progress</option>
//               <option value="completed">Completed</option>
//             </select>
//           </div>

//           {/* Optional: Invite Collaborator */}
//           <div className="pt-2">
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Invite Collaborator (optional)
//             </label>
//             <div className="flex space-x-2">
//               <input
//                 type="email"
//                 value={inviteEmail}
//                 onChange={(e) => setInviteEmail(e.target.value)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
//                 placeholder="Enter email to invite"
//               />
//               <button
//                 type="button"
//                 onClick={() => alert(`Invite sent to ${inviteEmail}`)}
//                 className="bg-blue-500 text-white px-4 rounded-xl hover:bg-blue-600 transition"
//               >
//                 Invite
//               </button>
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
//           >
//             Create Task
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateTask;