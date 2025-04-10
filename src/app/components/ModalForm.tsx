/* eslint-disable @typescript-eslint/no-unused-vars */
// ModalForm.tsx
import React from "react";
import { useState } from "react";
import { createUserForAdmin } from "@/api/userAPI";
import Swal from "sweetalert2";
import "../../i18n";
import { useTranslation } from "react-i18next";

interface ModalFormProps {
  isFormVisible: boolean;
  handleCloseModal: () => void;
  token: string;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isFormVisible,
  handleCloseModal,
  token,
}) => {
  const { t } = useTranslation(); // ใช้ useTranslation เพื่อเรียกฟังก์ชัน t

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    role: "user",
    password: "",
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

    // สร้างตัวแปรเพื่อเก็บค่า confirmPassword จากฟอร์ม
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;

    // ตรวจสอบว่า password กับ confirmPassword ตรงกันหรือไม่
    if (formData.password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: t("mForm.error"),
        text: t("mForm.password_mismatch"),
      });
      return;
    }

    try {
      const createdUser = await createUserForAdmin(token, formData);
      Swal.fire({
        icon: "success",
        title: t("mForm.success"),
        text: t("mForm.user_created"),
      });
      handleCloseModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("mForm.error"),
        text: t("mForm.creation_failed"),
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
          {t("mForm.close")}
        </button>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 text-[14px] text-white">
          <div>
            <label htmlFor="firstName">{t("mForm.first_name")}</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="lastName">{t("mForm.last_name")}</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="email">{t("mForm.email")}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="username">{t("mForm.username")}</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="phoneNumber">{t("mForm.phone_number")}</label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
          </div>
          <div>
            <label htmlFor="role">{t("mForm.role")}</label>
            <select
              id="role"
              name="role"
              value={formData.role} // ใช้ value แทน selected
              onChange={handleChange} // ใช้ onChange เพื่อจับการเปลี่ยนแปลง
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] text-white border-[#5B5B5B]"
            >
              <option value="user">{t("mForm.roles.user")}</option>
              <option value="admin">{t("mForm.roles.admin")}</option>
            </select>
          </div>

          <div>
            <label htmlFor="password">{t("mForm.password")}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">{t("mForm.confirm_password")}</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button type="submit" className="text-white p-2 rounded w-full">
              {t("mForm.submit")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
