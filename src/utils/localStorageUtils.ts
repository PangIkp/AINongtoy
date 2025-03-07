export const getUserData = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
};

export const setUserData = (userData: any) => {
    localStorage.setItem("user", JSON.stringify(userData));
};