import React, { useEffect, useState, useRef } from "react";
import { FiLogOut } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, deleteTask, updateTask } from "../redux/taskSlice";
import { useNavigate } from "react-router-dom";
import TaskTable from "../components/Tables";
import { Pagination, TaskModal } from "../components/TaskUtils";
import { useToast } from "../utils/helpers";

const Home = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showSuccess, showError } = useToast();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    const [isOpen, setIsOpen] = useState(false);
    const [menuOpenId, setMenuOpenId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTaskId, setDeleteTaskId] = useState(null);

    const tasksPerPage = 5;
    const hasFetched = useRef(false);

    useEffect(() => {
        if (!hasFetched.current) {
            hasFetched.current = true;
            dispatch(fetchTasks())
                .unwrap()
        }
    }, [dispatch, showError]);

    const validTasks = Array.isArray(tasks) ? tasks : [];
    const indexOfLastTask = currentPage * tasksPerPage;
    const indexOfFirstTask = indexOfLastTask - tasksPerPage;
    const currentTasks = validTasks.slice(indexOfFirstTask, indexOfLastTask);
    const totalPages = Math.ceil(validTasks.length / tasksPerPage);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setTimeout(() => {
            navigate("/");
        }, 1000);
        setTimeout(() => {
            showSuccess("Logged out successfully!");
        }, 1100);
    };

    const handleAddTask = () => {
        setIsOpen(true);
    };

    const handleDeleteConfirmation = (taskId) => {
        setDeleteTaskId(taskId);

    };

    const handleDelete = async () => {
        if (!deleteTaskId) return;
        try {
            const deleteResponse = await dispatch(deleteTask(deleteTaskId)).unwrap();
            showSuccess(deleteResponse.message || "Task deleted successfully!");
            dispatch(fetchTasks()).unwrap();
        } catch (error) {
            showError(error.message || "Failed to delete task.");
        } finally {
            setDeleteTaskId(null);
        }
    };

    const handleCancelDelete = () => {
        setDeleteTaskId(null);
    };

    const handleEdit = async (taskData) => {
        try {
            await dispatch(updateTask(taskData)).unwrap();
            showSuccess("Task updated successfully!");
        } catch (error) {
            showError(error.message || "Failed to update task.");
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-3xl font-semibold text-blue-700">
                Tasks Management
            </h1>
            <div className="flex items-end justify-between mb-4">
                <div className="flex flex-col sm:flex-row justify-end w-full gap-2">
                    <button
                        onClick={handleAddTask}
                        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded-full shadow-md hover:bg-blue-800 cursor-pointer"
                    >
                        <FaPlus size={15} /> Add Task
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-full shadow-md hover: cursor-pointer"
                    >
                        <FiLogOut color="red" size={20} /> logout
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center mt-8 text-blue-600">
                    <svg
                        className="animate-spin h-10 w-10 mb-2 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
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
                    <p className="text-center text-lg font-medium">Loading tasks...</p>
                </div>
            ) : error ? (
                <div className="flex flex-col items-center justify-center mt-8 text-red-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <p className="text-center text-lg font-medium">{error}</p>
                </div>
            ) : (
                <>
                    <TaskTable
                        tasks={currentTasks}
                        menuOpenId={menuOpenId}
                        setMenuOpenId={setMenuOpenId}
                        indexOfFirstTask={indexOfFirstTask}
                        onDelete={handleDeleteConfirmation}
                        onEdit={handleEdit}
                    />
                    <Pagination
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        totalPages={totalPages}
                    />
                </>
            )}
            <TaskModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
            {deleteTaskId && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray bg-opacity-50 z-50 backdrop-blur-sm">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                        <p>Are you sure you want to delete this task?</p>
                        <div className="flex gap-4 mt-4">
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                            >
                                Yes, Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default Home;
