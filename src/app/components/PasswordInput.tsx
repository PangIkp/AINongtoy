import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface PasswordInputProps {
    id: string;
    name: string;
    label?: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    minLength?: number;
    required?: boolean; // เพิ่ม required เป็น optional props
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, name, label, value, placeholder, onChange, minLength = 6, required = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleBlur = () => {
        if (value.length < minLength) {
            setError(`Min length is ${minLength} chars.`);
        } else {
            setError(null);
        }
    };

    return (
        <label htmlFor={id} className="relative block">
            <p>
                {label} {required && <span className="text-red-500">*</span>} {/* เพิ่ม * สีแดงถ้า required */}
            </p>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    onBlur={handleBlur}
                    className="w-full py-2 border border-gray-300 rounded"
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent text-black hover:text-[#0AACF0] p-1"
                >
                    {showPassword ? <FaEye className="text-[#9F9F9F]" /> : <FaEyeSlash className="text-[#9F9F9F]" />}
                </button>
            </div>
            {/* {error && <p className="text-yellow-500 text-[12px]">{error}</p>} */}
        </label>
    );
};

export default PasswordInput;