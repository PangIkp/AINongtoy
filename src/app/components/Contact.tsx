import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import emailjs from "emailjs-com";

export default function Contact() {
    const [formData, setFormData] = useState({
        fName: "",
        lName: "",
        email: "",
        phone: ""
    });

    const [errors, setErrors] = useState({
        fName: "",
        lName: "",
        email: "",
        phone: ""
    });

    const [successMessage, setSuccessMessage] = useState("");

    const validateField = (name: keyof typeof formData, value: string) => {
        let error = "";
        if (value.trim() === "") {
            return error;
        }
        switch (name) {
            case "fName":
                if (!/^[a-zA-Zก-ฮะ-ูเ-์]+$/.test(value)) {
                    error = "First Name : only letters";
                }
                break;
            case "lName":
                if (!/^[a-zA-Zก-ฮะ-ูเ-์]+$/.test(value)) {
                    error = "Last Name : only letters";
                }
                break;
            case "email":
                if (!/^[a-zA-Z][^\s@]*@[a-zA-Z]{2,}(\.[a-zA-Z]{2,}){1,2}$/.test(value)) {
                    error = "Email: Invalid.";
                }
                break;
            case "phone":
                if (!/^0\d{2}-\d{3}-\d{4}$/.test(value)) {
                    error = "Phone: 10 digits, start with 0.";
                }
                break;
            default:
                break;
        }
        return error;
    };

    const validateForm = () => {
        let valid = true;
        let newErrors: { [key in keyof typeof formData]: string } = { fName: "", lName: "", email: "", phone: "" };

        for (const field in formData) {
            if (formData.hasOwnProperty(field)) {
                const error = validateField(field as keyof typeof formData, formData[field as keyof typeof formData]);
                if (error) {
                    newErrors[field as keyof typeof formData] = error;
                    valid = false;
                }
            }
        }

        setErrors(newErrors);
        return valid;
    };

    useEffect(() => {
        validateForm();
    }, [formData]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "phone") {
            formattedValue = value
                .replace(/\D/g, "")
                .replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3")
                .slice(0, 12);
        }

        setFormData({ ...formData, [name]: formattedValue });
        setSuccessMessage(""); // Clear success message on input change
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validateForm()) {
            emailjs.sendForm('service_g1z0gpm', 'template_avfxlaa', e.target as HTMLFormElement, 'VzQC9poepjolu-W_1')
                .then((result) => {
                    console.log(result.text);
                    setFormData({ fName: "", lName: "", email: "", phone: "" });
                    setSuccessMessage("Form submitted successfully!");
                }, (error) => {
                    console.log(error.text);
                });
        }
    };

    const isFormValid = () => {
        return Object.values(errors).every(error => error === "") &&
            Object.values(formData).every(value => value.trim() !== "");
    };

    return (
        <div className="place-items-center h-[600px] my-20 mx-[13vw]">
            <div className="max-w-7xl w-full h-full flex gap-x-12">
                {/* ฝั่งซ้าย (Form) */}
                <div className="w-full h-full">
                    <div className="w-full h-full">
                        <div className="w-full h-[30%]">
                            <p className="text-[#0AACF0] font-semibold mb-4">CONTACT US</p>
                            <h1 className="text-[30px] sm:text-[40px] md:text-[45px] font-semibold">
                                We will get back to you asap!
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col w-full h-[60%] mt-[30px]">
                            <div className="flex flex-col justify-between h-full w-full">
                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-x-4">
                                    <div>
                                        <label htmlFor="fName" className="text-[16px]">
                                            First Name
                                            <input
                                                name="fName"
                                                value={formData.fName}
                                                minLength={4}
                                                maxLength={30}
                                                onChange={handleChange}
                                                className="block px-2 py-2 border border-gray-300 rounded-md"
                                                type="text"
                                                required
                                            />
                                            <p className="text-xs mt-1 text-yellow-500 h-4">{errors.fName}</p>
                                        </label>
                                    </div>

                                    <div>
                                        <label htmlFor="lName" className="text-[16px]">
                                            Last Name
                                            <input
                                                name="lName"
                                                value={formData.lName}
                                                minLength={4}
                                                maxLength={30}
                                                onChange={handleChange}
                                                className="block px-2 py-2 border border-gray-300 rounded-md"
                                                type="text"
                                                required
                                            />
                                            <p className="text-xs mt-1 text-yellow-500 h-4">{errors.lName}</p>
                                        </label>
                                    </div>
                                </div>

                                <label htmlFor="email" className="text-[16px]">
                                    Email
                                    <input
                                        name="email"
                                        value={formData.email}
                                        minLength={5}
                                        maxLength={50}
                                        onChange={handleChange}
                                        className="block px-2 py-2 border border-gray-300 rounded-md"
                                        type="email"
                                        required
                                    />
                                    <p className="text-xs mt-1 text-yellow-500 h-4">{errors.email}</p>
                                </label>
                                <label htmlFor="phone" className="text-[16px]">
                                    Phone Number
                                    <input
                                        name="phone"
                                        value={formData.phone}
                                        minLength={12}
                                        maxLength={12}
                                        onChange={handleChange}
                                        className="block px-2 py-2 border border-gray-300 rounded-md"
                                        type="text"
                                        required
                                    />
                                    <p className="text-xs mt-1 text-yellow-500 h-4">{errors.phone}</p>
                                </label>
                                <button className="mt-2 py-2" type="submit" disabled={!isFormValid()}>Submit</button>

                            </div>
                        </form>
                        <div className="h-4 mt-1">
                            <p className="text-green-500 text-sm h-4 m-1">{successMessage}</p>
                        </div>
                    </div>
                </div>

                {/* ฝั่งขวา (Image) */}
                <div className="w-full max-xl:hidden flex items-end">
                    <img src="/Images/AINongtoy/Contact.png" alt="contact" className=" h-auto object-cover mb-[1vw]" />
                </div>
            </div>
        </div>
    );
}