import { createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axiosInstance";

const initialState = {
    token: localStorage.getItem("authtoken") || null,
    user: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        loginSuccess: (state, action) => {
            state.loading = false;
            state.token = action.payload.token;
            state.user = action.payload.user;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            localStorage.removeItem("authtoken");
        },
        registerSuccess: (state) => {
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    registerSuccess,
} = authSlice.actions;

export const login =
    (email, password, showSuccess, showError, onSuccess) => async (dispatch) => {
        dispatch(loginStart());
        try {
            const response = await axiosInstance.post("/api/users/login", {
                email,
                password,
            });
            const { token, user, message } = response.data;
            localStorage.setItem("authtoken", token);
            dispatch(loginSuccess({ token, user }));
            showSuccess(message);
            if (onSuccess) onSuccess();
        } catch (error) {
            const msg = error.response?.data?.message || "Login failed!";
            dispatch(loginFailure(msg));
            showError(msg);
        }
    };

export const register =
    (email, password, showSuccess, showError, onSuccess) => async (dispatch) => {
        dispatch(loginStart());

        try {
            const response = await axiosInstance.post("/api/users/register", {
                email,
                password,
            });

            dispatch(registerSuccess());
            showSuccess(response?.data?.message || "Registration successful!");

            if (onSuccess) onSuccess();
        } catch (error) {
            const status = error.response?.status;
            const errors = error.response?.data?.errors || [];
            const fallbackMsg = error.response?.data?.message || "Something went wrong.";

            const errorPayload = {
                status,
                errors: Array.isArray(errors) && errors.length > 0
                    ? errors
                    : [{ path: "form", msg: fallbackMsg }],
            };

            // Show only 1 general toast error message (optional)
            showError(errorPayload.errors.map((e) => e.msg).join(", "));

            dispatch(loginFailure(errorPayload));
        }
    };

export default authSlice.reducer;
