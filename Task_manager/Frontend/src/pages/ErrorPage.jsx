import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

const Error404 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6 overflow-hidden">

            {/* floating animated circle background */}
            <div className="absolute w-72 h-72 bg-purple-200/50 rounded-full blur-[80px] animate-float" />

            <div
                className="relative bg-white px-14 py-16 rounded-3xl shadow-[0_10px_50px_rgba(0,0,0,0.1)] max-w-lg w-full text-center border border-gray-200 animate-zoomIn"
            >
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                    <AlertTriangle className="h-10 w-10 text-blue-600" />
                </div>

                <h1 className="text-7xl font-extrabold text-gray-800 tracking-tight">404</h1>
                <p className="mt-3 text-2xl font-semibold text-gray-700 mb-2">
                    Page Not Found
                </p>
                <p className="text-gray-500 mb-10">
                    The page you’re looking for doesn’t seem to exist.
                </p>

                <Link
                    to="/"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-2xl font-medium transition duration-200 active:scale-95"
                >
                    Back to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Error404;
