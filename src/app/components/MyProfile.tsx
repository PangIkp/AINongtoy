import React, { useEffect, useState } from "react";

function MyProfile() {
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  useEffect(() => {
    // ดึงข้อมูล user จาก localStorage
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setFirstName(parsedUser.firstName); // ตั้งค่า firstName จากข้อมูล user
      setLastName(parsedUser.lastName); // ตั้งค่า lastName จากข้อมูล user
    }
  }, []);

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
      <div className="place-items-end place-content-center">
        <a href="/editProfile">
          <button className="bg-background border border-white font-normal text-xs py-1 px-3">
            Edit Profile
          </button>
        </a>
      </div>
    </section>
  );
}

export default MyProfile;
