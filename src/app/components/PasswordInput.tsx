import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
    id: string;
    name: string;
    label?: string;
    value: string;
    placeholder?: string; // เพิ่ม placeholder เป็น optional props
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, name, label, value, placeholder, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <label htmlFor={id} className="relative block">
            <p>{label}</p>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder} // ใช้ placeholder ที่ส่งมา
                    onChange={onChange}
                    className="w-full py-2 border border-gray-300 rounded"
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-black hover:text-[#0AACF0] p-1"
                >
                    {showPassword ? <FaEye className='text-[#9F9F9F]' /> : <FaEyeSlash className='text-[#9F9F9F]' />}
                </button>
            </div>
        </label>
    );
};

export default PasswordInput;