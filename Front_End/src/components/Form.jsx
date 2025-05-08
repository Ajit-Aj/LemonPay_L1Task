import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FaCheck } from "react-icons/fa";

const AuthForm = ({
    type,
    email,
    password,
    confirmPassword,
    onChange,
    onSubmit,
    showConfirmPassword,
    error,
    toggleMode,
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isChecked, setIsChecked] = useState(false);

    const focusShadow = "focus:shadow-md focus:shadow-yellow-400/90 focus:outline-none";
    const inputClasses =
        "w-full h-[46.3px] rounded-md bg-opacity-20 border border-[#E4E4E7] px-3 text-white placeholder-white";

    const getFieldErrors = (fieldName) => {
        if (Array.isArray(error?.errors)) {
            return error.errors
                .filter((err) => err.path === fieldName)
                .map((err) => (typeof err.msg === "string" ? err.msg : JSON.stringify(err.msg)));
        }
        return [];
    };

    const getFormErrors = () => {
        if (Array.isArray(error?.errors)) {
            return error.errors
                .filter((err) => err.path === "form")
                .map((err) => (typeof err.msg === "string" ? err.msg : JSON.stringify(err.msg)));
        }
        return [];
    };

    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 max-w-[378px] w-full mx-auto"
            autoComplete="off"
        >
            <div className="flex flex-col">
                <label className="text-sm font-medium text-white mb-1">Email</label>
                <input
                    type="email"
                    name="email"
                    required
                    value={email}
                    onChange={onChange}
                    className={`${inputClasses} ${focusShadow}`}
                    placeholder="example@domain.com"
                />
                {getFieldErrors("email").map((msg, idx) => (
                    <span key={idx} className="text-sm text-red-400 mt-1 font-semibold">{msg}</span>

                ))}
            </div>

            <div className="flex flex-col relative">
                <label className="text-sm font-medium text-white mb-1">Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    value={password}
                    onChange={onChange}
                    className={`${inputClasses} ${focusShadow}`}
                    placeholder="Min 8 characters"
                />
                <div
                    className="absolute right-3 top-[38px] cursor-pointer text-white"
                    onClick={() => setShowPassword((prev) => !prev)}
                >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </div>
                {getFieldErrors("password").map((msg, idx) => (
                    <span key={idx} className="text-sm text-red-400 mt-1 font-semibold">{msg}</span>

                ))}
            </div>

            {showConfirmPassword && (
                <div className="flex flex-col relative">
                    <label className="text-sm font-medium text-white mb-1">Confirm Password</label>
                    <input
                        type={showConfirm ? "text" : "password"}
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={onChange}
                        className={`${inputClasses} ${focusShadow}`}
                        placeholder="Confirm password"
                        required
                    />
                    <div
                        className="absolute right-3 top-[38px] cursor-pointer text-white"
                        onClick={() => setShowConfirm((prev) => !prev)}
                    >
                        {showConfirm ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </div>
                    {getFieldErrors("confirmPassword").map((msg, idx) => (
                        <span key={idx} className="text-sm text-red-400 mt-2 font-semibold">{msg}</span>

                    ))}
                </div>
            )}

            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                    <div
                        className={`h-4 w-4 border border-white flex items-center justify-center rounded-sm cursor-pointer transition duration-150 ${isChecked ? "bg-white" : "bg-transparent"
                            }`}
                        onClick={() => setIsChecked(!isChecked)}
                    >
                        {isChecked && <FaCheck className="text-black text-xs" />}
                    </div>
                    <label className="text-sm text-white cursor-pointer" onClick={() => setIsChecked(!isChecked)}>
                        Remember me
                    </label>
                </div>
                <button
                    type="button"
                    onClick={toggleMode}
                    className="text-sm font-semibold text-white hover:underline"
                >
                    {type === "signIn" ? "Sign Up" : "Sign In"}
                </button>
            </div>

            <button
                type="submit"
                className="mt-4 w-full h-[46.3px] rounded-md bg-white font-semibold text-black hover:bg-gray-200 transition"
            >
                {type === "signIn" ? "Sign In" : "Sign Up"}
            </button>
        </form>
    );
};

export default AuthForm;
