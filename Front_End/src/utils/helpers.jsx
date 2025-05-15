import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
    };
    const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
    return formattedDate;
};

export const getMinDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDueDate = (dateString) => {
    const localDate = new Date(dateString);
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    const year = localDate.getFullYear();
    let hours = localDate.getHours();
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    const meridian = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const formattedHours = String(hours).padStart(2, '0');
    return `${month}/${day}/${year} ${formattedHours}:${minutes} ${meridian}`;
};

export const useToast = () => {
    const showSuccess = (msg) => toast.success(msg);
    const showError = (msg) => toast.error(msg);
    const showInfo = (msg) => toast.info(msg);
    const showWarning = (msg) => toast.warn(msg);

    return { showSuccess, showError, showInfo, showWarning };
};

export const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("authtoken");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return children;
};
