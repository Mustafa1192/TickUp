// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Link } from 'react-router-dom';
// import { useAppContext } from '../Context/AppContext';
// import { FaCalendarAlt, FaStar } from 'react-icons/fa';

// const ImportantTasks = () => {
//     const { backendUrl } = useAppContext();
//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchImportant = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const res = await axios.get(`${backendUrl}/api/tasks/important`, {
//                     headers: { Authorization: `Bearer ${token}` },
//                 });
//                 setTasks(res.data);
//             } catch (err) {
//                 console.error('Failed to fetch important tasks:', err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchImportant();
//     }, [backendUrl]);

//     if (loading) {
//         return (
//             <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-70 z-50 gap-4">
//                 <svg
//                     className="animate-spin h-14 w-14 text-blue-600"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                     aria-label="Loading"
//                 >
//                     <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                     />
//                     <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//                     />
//                 </svg>
//                 <p className="text-blue-700 font-semibold text-lg select-none">
//                     Syncing your TickUp data…
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] p-6">
//             <h1 className="text-3xl font-bold mb-6 flex items-center gap-2 mt-14 text-gray-800">
//                 <FaStar className="text-yellow-400" /> Important Tasks
//             </h1>

//             {tasks.length > 0 ? (
//                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//                     {tasks.map((task) => (
//                         <div
//                             key={task._id}
//                             className="bg-white/80 backdrop-blur-lg rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer"
//                         >
//                             <h2 className="font-semibold text-lg text-gray-900 truncate">
//                                 {task.title}
//                             </h2>
//                             <p className="text-gray-600 text-sm mb-3 line-clamp-3 min-h-[3.5rem]">
//                                 {task.description || 'No description available.'}
//                             </p>
//                             {task.deadline && (
//                                 <div className="flex items-center text-sm text-blue-600 mb-3">
//                                     <FaCalendarAlt className="mr-2" />
//                                     <time dateTime={task.deadline}>
//                                         {new Date(task.deadline).toLocaleDateString(undefined, {
//                                             year: 'numeric',
//                                             month: 'short',
//                                             day: 'numeric',
//                                         })}
//                                     </time>
//                                 </div>
//                             )}
//                             <Link
//                                 to={`/tasks/${task._id}`}
//                                 className="text-blue-600 hover:text-blue-800 text-sm font-medium"
//                                 aria-label={`View details for ${task.title}`}
//                             >
//                                 View Details
//                             </Link>
//                         </div>
//                     ))}
//                 </div>
//             ) : (
//                 <div className="flex flex-col items-center justify-center mt-22 text-gray-500 select-none mt-[15rem]">
//                     <FaStar className="text-6xl mb-4 opacity-40" />
//                     <p className="text-lg font-light">No important tasks found</p>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ImportantTasks;
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAppContext } from '../Context/AppContext';
import { FaCalendarAlt, FaStar } from 'react-icons/fa';

const ImportantTasks = () => {
    const { backendUrl } = useAppContext();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImportant = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`${backendUrl}/api/tasks/important`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTasks(res.data);
            } catch (err) {
                console.error('Failed to fetch important tasks:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchImportant();
    }, [backendUrl]);

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
        <div className="min-h-screen bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 flex items-center gap-2 mt-14 text-gray-800">
                <FaStar className="text-yellow-400" /> Important Tasks
            </h1>

            {tasks.length > 0 ? (
                <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="bg-white/80 backdrop-blur-lg rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100 cursor-pointer"
                        >
                            <h2 className="font-semibold text-base sm:text-lg text-gray-900 break-words">
                                {task.title}
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-3 min-h-[3.5rem] break-words">
                                {task.description || 'No description available.'}
                            </p>
                            {task.deadline && (
                                <div className="flex items-center text-xs sm:text-sm text-blue-600 mb-3">
                                    <FaCalendarAlt className="mr-2" />
                                    <time dateTime={task.deadline}>
                                        {new Date(task.deadline).toLocaleDateString(undefined, {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </time>
                                </div>
                            )}
                            <Link
                                to={`/tasks/${task._id}`}
                                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium"
                                aria-label={`View details for ${task.title}`}
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 select-none mt-[15rem]">
                    <FaStar className="text-6xl mb-4 opacity-40" />
                    <p className="text-lg font-light">No important tasks found</p>
                </div>
            )}
        </div>
    );
};

export default ImportantTasks;