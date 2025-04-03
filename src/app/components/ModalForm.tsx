// ModalForm.tsx
import React from "react";

interface ModalFormProps {
  isFormVisible: boolean;
  handleCloseModal: () => void;
}

const ModalForm: React.FC<ModalFormProps> = ({
  isFormVisible,
  handleCloseModal,
}) => {
  if (!isFormVisible) return null;

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

        <form className="grid grid-cols-2 gap-4 text-[14px] text-white">
          <div>
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="userEmail">Email</label>
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              name="userName"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="userPhone">Phone number</label>
            <input
              type="text"
              id="userPhone"
              name="userPhone"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border border-[#5B5B5B] text-white"
            />
          </div>
          <div>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] text-white border border-[#5B5B5B] text-white"
            >
              <option value="Admin" disabled selected>
                Select role
              </option>
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
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border border-[#5B5B5B] text-white"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="mt-2 p-2 border w-full bg-[#2F2F2F] text-[12px] border border-[#5B5B5B] text-white"
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
