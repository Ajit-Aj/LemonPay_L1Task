import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 px-4">
            <div className="text-center text-white max-w-xl">
                <h1 className="text-5xl font-extrabold mb-4">Welcome to TaskManager</h1>
                <p className="text-lg mb-8 text-gray-300">
                    Stay organized and productive by creating, updating, and managing your daily tasks.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-block px-6 py-3 bg-white text-black font-semibold rounded hover:bg-gray-200 transition"
                >
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Home;
