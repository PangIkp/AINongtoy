export const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const setUserData = (userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("User data set in localStorage:", userData); // เพิ่มบรรทัดนี้เพื่อแสดงค่าที่ถูกตั้งค่า
};