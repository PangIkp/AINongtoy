import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
    id: string;
    label: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, label }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <label htmlFor={id} className="relative">
            {label}
            <input type={showPassword ? "text" : "password"} id={id} />
            <button type="button" onClick={togglePasswordVisibility} className="absolute right-1 top-1/2 transform-translate-y-1/2 bg-white hover:bg-white text-black hover:text-[#0AACF0] p-1">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
        </label>
    );
};

export default PasswordInput;