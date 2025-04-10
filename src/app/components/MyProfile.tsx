import React, { useEffect, useState } from "react";
import { getUserData } from "../../utils/localStorageUtils";
import Swal from "sweetalert2";

interface MyProfileProps {
  followMessage?: string; // เพิ่ม props สำหรับข้อความ (ไม่บังคับ)
}

function MyProfile({ followMessage = "" }: MyProfileProps) {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    const parsedUser = getUserData();
    if (parsedUser) {
      setFirstName(parsedUser.firstName);
      setLastName(parsedUser.lastName);
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/login";
  };

  const confirmLogout = () => {
    Swal.fire({
      title: 'Log out',
      text: 'Are you sure you want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
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
    <section className="px-4 flex justify-between sm:flex-row flex-col items-center gap-y-7">
      <div className="flex gap-5">
        <img
          className="w-[60px] h-[60px] object-contain"
          src="/Images/AINongtoy/Profile.png"
          alt="profile"
        />
        <div className="w-[80%] place-content-center">
          <h1 className="text-xl font-semibold">
            {firstName} {lastName}
          </h1>
          <p className="text-xs text-[#BBBBBB]">
            {followMessage} {/* ใช้ข้อความจาก props */}
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
            e.preventDefault();
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