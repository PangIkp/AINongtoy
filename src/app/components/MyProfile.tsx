import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/localStorageUtils";
import Swal from "sweetalert2";

function MyProfile() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    // ดึงข้อมูล user จาก localStorage
    const parsedUser = getUserData();
    if (parsedUser) {
      setFirstName(parsedUser.firstName); // ตั้งค่า firstName จากข้อมูล user
      setLastName(parsedUser.lastName); // ตั้งค่า lastName จากข้อมูล user
    }
  }, []);

  const handleLogout = async () => {
    // เรียก API logout
    await fetch("/api/logout", { method: "POST" });

    // ลบข้อมูลที่เก็บไว้ใน localStorage และ sessionStorage
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // รีเฟรชไปที่หน้า Login
    window.location.href = "/login";
  };

  const confirmLogout = () => {
    Swal.fire({
      title: 'Log out',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#51536D',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleLogout();
      }
    });
  };

  return (
    <section className="px-4 flex justify-between">
      <div className="flex gap-5">
        <img
          className="w-[14%] object-contain"
          src="/Images/AINongtoy/Profile.png"
          alt="profile"
        />
        <div className="w-[80%] place-content-center">
          <h1 className="text-xl font-semibold">
            {firstName} {lastName}
          </h1>{" "}
          {/* แสดงชื่อและนามสกุล */}
          <p className="text-xs text-[#BBBBBB]">
            You have 200 models to follow
          </p>
        </div>
      </div>
      <div className="place-items-end space-x-2 place-content-center">
        <a href="/editProfile">
          <button className="bg-background border border-white font-normal text-xs py-1 px-3">
            Edit Profile
          </button>
        </a>
        <button
          onClick={(e) => {
            e.preventDefault(); // ป้องกันการรีเฟรชหน้า
            confirmLogout();
          }}
          className="bg-red-300 hover:bg-red-400 border border-red-400 text-black font-normal text-xs py-1 px-3 rounded"
        >
          Log out
        </button>
      </div>
    </section>
  );
}

export default MyProfile;