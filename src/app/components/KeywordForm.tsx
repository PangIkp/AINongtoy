/* eslint-disable @typescript-eslint/no-unused-vars */
// ModalForm.tsx
import React from "react";
import { useState } from "react";
import { createKeywordForAdmin } from "@/api/keywordAPI";
import Swal from "sweetalert2";

interface KeywordFormProps {
    isFormVisible: boolean;
    handleCloseModal: () => void;
    token: string;
    fetchAdminKeywords: () => void;
  }
  

  const KeywordForm: React.FC<KeywordFormProps> = ({
    isFormVisible,
    handleCloseModal,
    token,
    fetchAdminKeywords,
  }) => {
  
  
  const [formData, setFormData] = useState({
    name: "",
    type:"Color",
  });

  const [errors, setErrors] = useState({
    name: "",
    type: "",
  });
  
  if (!isFormVisible) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    let isValid = true;
    const newErrors = { name: "", type: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!formData.type.trim()) {
      newErrors.type = "Type is required.";
      isValid = false;
    }

    setErrors(newErrors);
    if (!isValid) return;

    try {
      const createdKeyword = await createKeywordForAdmin(token, formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Keyword created successfully!",
      });
      handleCloseModal();
      fetchAdminKeywords();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error creating keyword.",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#212121] p-8 rounded-lg w-[500px] relative">
        {/* ปุ่มปิด modal */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 text-gray-600"
        >
          X
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-[14px] text-white">
          <div>
            <label htmlFor="firstName">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="role">Type</label>
            <select
              id="type"
              name="type"
              value={formData.type} 
              onChange={handleChange} 
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] text-white border-[#5B5B5B]"
            >
              <option value="" disabled>
                Select type
              </option>{" "}
              <option value="admin">Color</option>
              <option value="user">Character</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-xs mt-1">{errors.type}</p>
            )}
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button type="submit" className="text-white p-2 rounded w-full">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );  
};

export default KeywordForm;
