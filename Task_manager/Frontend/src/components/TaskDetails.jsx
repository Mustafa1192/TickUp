import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useLocation } from 'react-router-dom';  // Added useLocation
import { useAppContext } from '../Context/AppContext';
import { FaCalendarAlt } from 'react-icons/fa';

const TaskDetails = () => {
    const { id } = useParams();
    const location = useLocation();  // Get location object
    const { backendUrl } = useAppContext();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Helper to format date/time as dd/MM/yy, hh:mm:ss AM/PM
    const formatDateTime = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);

        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = String(d.getFullYear()).slice(-2);

        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const seconds = String(d.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;

        return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const token = localStorage.getItem('token');
                // Check if navigated from recycle bin by presence of state flag
                const isFromRecycleBin = location.state?.fromRecycleBin;
                const url = isFromRecycleBin
                    ? `${backendUrl}/api/tasks/recycle/${id}`  // fetch deleted task details
                    : `${backendUrl}/api/tasks/${id}`;         // fetch normal task details

                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setTask(response.data);
            } catch {
                setError('Failed to fetch task details');
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id, backendUrl, location.state]);

    if (loading) return <p className="text-center pt-12 text-gray-500">Loading task details...</p>;
    if (error) return <p className="text-center pt-12 text-red-500">{error}</p>;
    if (!task) return <p className="text-center pt-12 text-gray-700">Task not found</p>;

    return (
        <div className="min-h-screen flex justify-center items-start bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] px-6 py-12">
            <div className="w-full max-w-xl bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-8 mt-[2.8rem]">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Task Details</h1>

                <div className="space-y-6 text-gray-800 text-sm sm:text-base">
                    <section>
                        <h2 className="font-semibold mb-1">Title</h2>
                        <p className="break-words">{task.title}</p>
                    </section>

                    <section>
                        <h2 className="font-semibold mb-1">Description</h2>
                        <p className="whitespace-pre-wrap text-gray-700">{task.description || 'No description provided.'}</p>
                    </section>

                    <section>
                        <h2 className="font-semibold flex items-center gap-2 mb-1">
                            <FaCalendarAlt className="text-blue-600" />
                            Deadline
                        </h2>
                        <p>{task.deadline ? formatDateTime(task.deadline) : 'No deadline set'}</p>
                    </section>

                    <section>
                        <h2 className="font-semibold mb-1">Status</h2>
                        <p
                            className={`capitalize inline-block px-3 py-1 rounded-full font-semibold ${task.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : task.status === 'in-progress'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}
                        >
                            {task.status.replace('-', ' ')}
                        </p>
                    </section>

                    <section>
                        <h2 className="font-semibold mb-1">Collaborators</h2>
                        {task.collaborators && task.collaborators.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700">
                                {task.collaborators.map((user, idx) => (
                                    <li key={idx}>{user.username ? `${user.username} (${user.email})` : user.email}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">No collaborators added</p>
                        )}
                    </section>

                    <section className="flex justify-between text-xs text-gray-500">
                        <div>
                            <span className="font-semibold">Created At:</span>
                            <br />
                            {formatDateTime(task.createdAt)}
                        </div>
                        <div>
                            <span className="font-semibold">Last Updated:</span>
                            <br />
                            {formatDateTime(task.updatedAt)}
                        </div>
                    </section>
                    <section>
                        <h2 className="font-semibold mb-1">Activity</h2>
                        {task.activityLog && task.activityLog.length > 0 ? (
                            <ul className="list-disc list-inside text-gray-700 text-xs">
                                {task.activityLog.map((log, idx) => (
                                    <li key={idx}>
                                        {log.user?.username || log.user?.email} {log.message} ({formatDateTime(log.at)})
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-xs">No activity recorded</p>
                        )}

                    </section>
                    <div className="mt-8 text-center">
                        <Link
                            to="/tasks"
                            className="inline-block px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-shadow shadow-md"
                        >
                            Back to Tasks
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskDetails;
