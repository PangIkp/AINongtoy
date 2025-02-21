import React from "react";

function MyProfile() {
  return (
    <section className="flex justify-between">
      <div className="flex gap-5">
        <img
          className="w-[20%] object-contain"
          src="/Images/AINongtoy/Profile.png"
          alt="profile"
        />
        <div className="w-[80%] place-content-center">
          <h1 className="text-xl font-semibold">Cameron Williamson</h1>
          <p className="text-xs text-[#BBBBBB]">
            You have 200 models to follow
          </p>
        </div>
      </div>
      <div className="place-aitems-end place-content-center">
        <button className="bg-background border border-white font-normal text-xs py-1 px-3">
          Edit Profile
        </button>
      </div>
    </section>
  );
}

export default MyProfile;
