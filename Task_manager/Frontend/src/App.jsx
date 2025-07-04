import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Signup from './pages/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-6 pb-0 ">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks" 
              element={
                <ProtectedRoute>
                  <Tasks />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks/new" 
              element={
                <ProtectedRoute>
                  <CreateTask />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tasks/edit/:id" 
              element={
                <ProtectedRoute>
                  <EditTask />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;