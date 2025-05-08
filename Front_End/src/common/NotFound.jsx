import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white px-4">
            <div className="text-center">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-2xl font-semibold mb-2">Page Not Found</p>
                <p className="mb-6 text-gray-400">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-2 text-sm font-medium text-black bg-white rounded hover:bg-gray-200 transition"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
