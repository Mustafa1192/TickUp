import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../Context/AppContext';
import { FaTrashRestore, FaCalendarAlt, FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Added for navigation

// Simple reusable confirmation modal
const ConfirmModal = ({ message, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl p-6 shadow-xl w-96">
            <p className="text-lg text-gray-800 mb-6">{message}</p>
            <div className="flex justify-end gap-3">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                    Cancel
                </button>
                <button
                    onClick={onConfirm}
                    className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
                >
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

const RecycleBin = () => {
    const { backendUrl } = useAppContext();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [confirmData, setConfirmData] = useState({ show: false, action: null, message: '', payload: null });

    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        fetchDeletedTasks();
    }, [backendUrl]);

    const fetchDeletedTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${backendUrl}/api/tasks/recycle`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(res.data);
        } catch (err) {
            console.error('Failed to fetch deleted tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async () => {
        const { action, payload } = confirmData;

        if (action === 'restoreOne') {
            await restoreTask(payload);
        } else if (action === 'restoreAll') {
            await restoreAllTasks();
        } else if (action === 'emptyBin') {
            await emptyRecycleBin();
        }

        setConfirmData({ show: false, action: null, message: '', payload: null });
    };

    const restoreTask = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${backendUrl}/api/tasks/${id}/restore`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks(prev => prev.filter(task => task._id !== id));
        } catch (err) {
            console.error('Failed to restore task:', err);
        }
    };

    const restoreAllTasks = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${backendUrl}/api/tasks/restore-all`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([]);
        } catch (err) {
            console.error('Failed to restore all tasks:', err);
        }
    };

    const emptyRecycleBin = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${backendUrl}/api/tasks/empty-bin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTasks([]);
        } catch (err) {
            console.error('Failed to empty recycle bin:', err);
        }
    };

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
        <div className="min-h-screen bg-gradient-to-br from-[#f5f8ff] to-[#e3ebfb] p-6">
            {confirmData.show && (
                <ConfirmModal
                    message={confirmData.message}
                    onConfirm={handleConfirm}
                    onCancel={() => setConfirmData({ show: false, action: null, message: '', payload: null })}
                />
            )}

            <div className="flex justify-between items-center mt-14 mb-6">
                <h1 className="text-3xl font-bold text-gray-800">🗑️ Recycle Bin</h1>
                {tasks.length > 0 && (
                    <div className="hidden sm:flex gap-3">
                        {/* Restore All */}
                        <button
                            onClick={() =>
                                setConfirmData({
                                    show: true,
                                    action: 'restoreAll',
                                    message: 'Are you sure you want to restore all tasks?',
                                    payload: null
                                })
                            }
                            className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition text-sm shadow-sm"
                        >
                            <FaTrashRestore className="inline-block mr-2" /> Restore All
                        </button>

                        {/* Empty Bin */}
                        <button
                            onClick={() =>
                                setConfirmData({
                                    show: true,
                                    action: 'emptyBin',
                                    message: 'Are you sure you want to permanently delete all tasks? This cannot be undone.',
                                    payload: null
                                })
                            }
                            className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition text-sm shadow-sm"
                        >
                            <FaTrashAlt className="inline-block mr-2" /> Empty Bin
                        </button>
                    </div>
                )}
            </div>

            {/* Mobile fixed bottom buttons */}
            {tasks.length > 0 && (
                <div className="sm:hidden fixed bottom-0 left-0 w-full p-3 flex gap-5 shadow-lg z-50">
                    <button
                        onClick={() =>
                            setConfirmData({
                                show: true,
                                action: 'restoreAll',
                                message: 'Are you sure you want to restore all tasks?',
                                payload: null
                            })
                        }
                        className="flex-1 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition text-sm"
                    >
                        <FaTrashRestore className="inline-block mr-1" /> Restore All
                    </button>
                    <button
                        onClick={() =>
                            setConfirmData({
                                show: true,
                                action: 'emptyBin',
                                message: 'Are you sure you want to permanently delete all tasks? This cannot be undone.',
                                payload: null
                            })
                        }
                        className="flex-1 py-4 bg-red-600 text-white font-semibold rounded-full hover:bg-red-700 transition text-sm"
                    >
                        <FaTrashAlt className="inline-block mr-1" /> Empty Bin
                    </button>
                </div>
            )}

            {tasks.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map(task => (
                        <div
                            key={task._id}
                            className="bg-white/80 backdrop-blur-lg rounded-2xl p-5 shadow-md hover:shadow-xl transition-all border border-gray-100 cursor-pointer"
                            onClick={() => navigate(`/tasks/${task._id}`, { state: { fromRecycleBin: true } })}
                        >
                            <h2 className="font-semibold text-lg text-gray-800">{task.title}</h2>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
                            {task.deadline && (
                                <div className="flex items-center text-sm text-gray-500 mb-3">
                                    <FaCalendarAlt className="mr-2 text-blue-500" />
                                    {new Date(task.deadline).toLocaleDateString()}
                                </div>
                            )}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent card click
                                    setConfirmData({
                                        show: true,
                                        action: 'restoreOne',
                                        message: `Are you sure you want to restore "${task.title}"?`,
                                        payload: task._id
                                    });
                                }}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all shadow"
                            >
                                <FaTrashRestore /> Restore
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center text-gray-500 mt-[15rem]">
                    <FaTrashAlt className="text-6xl mb-4 text-gray-400" />
                    <p className="text-lg">Recycle Bin is empty</p>
                </div>
            )}
        </div>
    );
};

export default RecycleBin;
