// ModalForm.tsx
import React from "react";
import { createUserForAdmin } from "@/api/userAPI";
import Swal from "sweetalert2";

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
  if (!isFormVisible) return null;

  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    phoneNumber: "",
    role: "user",
    password: "",
  });

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
        title: "Error",
        text: "Passwords do not match!",
      });
      return;
    }

    try {
      const createdUser = await createUserForAdmin(token, formData);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "User created successfully!",
      });
      handleCloseModal();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error creating user.",
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
            <label htmlFor="firstName">First name</label>
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
            <label htmlFor="lastName">Last name</label>
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
            <label htmlFor="userEmail">Email</label>
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
            <label htmlFor="userName">Username</label>
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
            <label htmlFor="phoneNumber">Phone number</label>
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
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role} // ใช้ value แทน selected
              onChange={handleChange} // ใช้ onChange เพื่อจับการเปลี่ยนแปลง
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] text-white border-[#5B5B5B]"
            >
              <option value="" disabled>
                Select role
              </option>{" "}
              {/* ค่า default ที่ไม่สามารถเลือกได้ */}
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div>
            <label htmlFor="password">Password</label>
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
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border-[#5B5B5B] text-white"
            />
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

export default ModalForm;
