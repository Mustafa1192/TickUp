import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setTasks(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }
  const handleDelete = async (taskId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setTasks(tasks.filter(task => task._id !== taskId));
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <Link
          to="/tasks/new"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          Add New Task
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <div key={task._id} className="border rounded-lg p-4 shadow-sm">
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p className="text-gray-600 my-2">{task.description}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              task.status === 'completed' ? 'bg-green-100 text-green-800' :
              task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              {task.status}
            </span>
            <div className="mt-4 flex space-x-2">
              <Link
                to={`/tasks/edit/${task._id}`}
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </Link>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => handleDelete(task._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;