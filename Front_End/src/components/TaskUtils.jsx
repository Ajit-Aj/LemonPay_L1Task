import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTask, fetchTasks } from "../redux/taskSlice";
import { formatDueDate, getMinDateTime, useToast } from "../utils/helpers";
import { FaPlus, FaSignOutAlt } from "react-icons/fa";

export const Pagination = ({ currentPage, setCurrentPage, totalPages }) => {
    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 rounded-md shadow-md hover:bg-gray-100"
            >
                &lt;
            </button>
            <div className="hidden sm:flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === i + 1 ? 'bg-blue-700 text-white' : 'bg-white shadow-md hover:bg-gray-100'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                className="p-2 rounded-md shadow-md hover:bg-gray-100"
            >
                &gt;
            </button>
        </div>
    );
};

export const TaskModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const { showSuccess, showError } = useToast();

    const [taskName, setTaskName] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const stripHTML = (input) => input.replace(/<\/?[^>]+(>|$)/g, "");

    const resetForm = () => {
        setTaskName("");
        setDescription("");
        setDueDate("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const trimmedTaskName = stripHTML(taskName.trim());
        const trimmedDescription = stripHTML(description.trim());

        if (!trimmedTaskName || !dueDate) {
            showError("Task Title and Due Date are required.");
            return;
        }

        if (new Date(dueDate) < new Date()) {
            showError("Due Date cannot be in the past.");
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await dispatch(
                createTask({
                    taskName: trimmedTaskName,
                    description: trimmedDescription,
                    dueDate: formatDueDate(dueDate),
                })
            ).unwrap();

            if (result && (result.code === 200 || result.code === 201)) {
                showSuccess(result.message);
                dispatch(fetchTasks());

                resetForm();
                onClose();
            } else {
                showError(result.message || "Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error("Failed to create task:", error);
            showError(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        isOpen && (
            <>
                <div className="fixed inset-0 bg-grey backdrop-blur-sm z-40" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
                        <h2 className="text-2xl font-bold mb-6 text-center">Add Task</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="flex flex-col">
                                <input
                                    id="taskName"
                                    type="text"
                                    placeholder="Enter Task Name"
                                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={taskName}
                                    onChange={(e) => setTaskName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="flex flex-col">
                                <textarea
                                    id="description"
                                    placeholder="Description"
                                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="flex flex-col">
                                <input
                                    placeholder="Date Picker"
                                    id="dueDate"
                                    type="datetime-local"
                                    min={getMinDateTime()}
                                    className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={dueDate || ""}
                                    onChange={(e) => setDueDate(e.target.value)}
                                    onFocus={(e) => e.target.showPicker?.()}
                                    required
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:justify-between items-center mt-6 space-y-3 sm:space-y-0 sm:space-x-4 w-full">
                                <button
                                    type="button"
                                    className="bg-gray-300 text-black rounded-2xl px-6 py-3 text-base w-full sm:w-auto flex justify-center items-center space-x-2 transition duration-200 hover:bg-gray-400 cursor-pointer shadow-lg"
                                    onClick={onClose}
                                >
                                    <span className="hidden sm:inline">Cancel</span>
                                    <span className="sm:hidden"><FaSignOutAlt /></span>
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-blue-600 text-white rounded-2xl px-6 py-3 text-base w-full sm:w-auto flex justify-center items-center space-x-2 transition duration-200 hover:bg-blue-700 cursor-pointer shadow-lg ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                    disabled={isSubmitting}
                                >
                                    <span className="hidden sm:inline">
                                        {isSubmitting ? "Submitting..." : "Save"}
                                    </span>
                                    <span className="sm:hidden">
                                        {isSubmitting ? <FaPlus className="animate-spin" /> : <FaPlus />}
                                    </span>
                                </button>
                            </div>


                        </form>
                    </div>
                </div>
            </>
        )
    );
};

export const EditTaskModal = ({ show, onClose, editedTask, setEditedTask, onSave }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-grey bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white border border-gray-200 shadow-xl rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Edit Task</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        &times;
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">Task Name</label>
                    <input
                        type="text"
                        value={editedTask.taskName}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, taskName: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        value={editedTask.description}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, description: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                        type="datetime-local"
                        value={editedTask.dueDate}
                        onChange={(e) =>
                            setEditedTask({ ...editedTask, dueDate: e.target.value })
                        }
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="flex justify-end gap-2 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};
