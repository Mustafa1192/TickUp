import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import Login from './pages/Login';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ImportantTasks from './pages/ImportantTasks';
import RecycleBin from './pages/RecycleBin';
import ForgetPasswords from './pages/ForgetPasswords';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import Navbar from './components/Navbar';
import TaskDetails from './components/TaskDetails';
import { AppProvider } from './Context/AppContext';
import { ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

// Splash Screen Component
function SplashScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 5000); // 3 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center 
      bg-gradient-to-br from-blue-50 to-indigo-100 animate-gradient-bg">

      {/* Glass card */}
      <div className="relative bg-white/10 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-blue-400/20 text-center max-w-md w-full opacity-0 animate-fadeIn">

        {/* Icon with halo */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl animate-pulse-slow group-hover:opacity-90 transition-opacity duration-500"></div>
          <ClipboardDocumentCheckIcon
            className="w-28 h-28 mx-auto text-blue-600 relative z-10 animate-float-slow"
          />
        </div>

        {/* App name with gradient */}
        <h1 className="text-6xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent 
          bg-gradient-to-r from-blue-500 to-indigo-700 animate-fadeIn delay-200">
          TickUp
        </h1>

        {/* Tagline with interactive dots */}
        <div className="flex justify-center items-center space-x-3 mb-8">
          <p className="text-xl font-medium tracking-wide text-gray-700">
            {/* First part: Plan Smart, Achieve More! */}
            <span className="text-blue-600 hover:text-indigo-700 transition-colors animate-bounce-slow">
              Plan Smart
            </span>
            <span className="text-blue-600 mx-1.5 animate-ping-slow">•</span>
            <span className="text-blue-600 hover:text-indigo-700 transition-colors animate-bounce-slow delay-75">
              Achieve More!
            </span>

            {/* Line break for supporting text */}
            <br />

            {/* Second part: supporting line */}
            <span className="text-gray-500 text-base mt-2 block animate-fadeIn delay-150">
              🔥 Make every minute count, tick off every goal – TickUp
            </span>
          </p>

        </div>

        {/* Animated progress bar */}
        <div className="mt-8 h-2 bg-blue-400/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-700 animate-loading-stripes animate-shimmer"
            style={{
              backgroundSize: '40px 40px',
              animationDuration: '2.5s',
              boxShadow: '0 2px 10px -1px rgba(59, 130, 246, 0.5)'
            }}
          ></div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-slow { animation: float-slow 3s ease-in-out infinite; }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow { animation: pulse-slow 2s infinite; }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s forwards; }

        @keyframes gradient-bg {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-bg { 
          background-size: 400% 400%;
          animation: gradient-bg 15s ease infinite;
        }

        @keyframes loading-stripes {
          0% { background-position: 0 0; }
          100% { background-position: 40px 0; }
        }
        .animate-loading-stripes { animation: loading-stripes 1s linear infinite; }

        @keyframes shimmer {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        .animate-shimmer { animation: shimmer 1.5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash has already been shown in this session
    const hasSeen = sessionStorage.getItem('hasSeenSplash');
    return !hasSeen; // true = show splash if not seen
  });

  const handleFinishSplash = () => {
    sessionStorage.setItem('hasSeenSplash', 'true'); // mark as seen for this session
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleFinishSplash} />;
  }

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavbarWrapper />
          <main className="container mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forget-password" element={<ForgetPasswords />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
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
              <Route
                path="/tasks/:id"
                element={
                  <ProtectedRoute>
                    <TaskDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/important"
                element={
                  <ProtectedRoute>
                    <ImportantTasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recycle"
                element={
                  <ProtectedRoute>
                    <RecycleBin />
                  </ProtectedRoute>
                }
              />

              {/* Error page */}
              <Route path="/404" element={<ErrorPage />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

// Conditional Navbar wrapper
function NavbarWrapper() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup', '/forget-password', '/404'];

  // Hide the navbar on certain pages
  if (hideNavbarPaths.includes(location.pathname)) {
    return null;
  }
  return <Navbar />;
}

export default App;