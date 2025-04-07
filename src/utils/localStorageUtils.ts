/* eslint-disable @typescript-eslint/no-explicit-any */ 
export const getUserData = () => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    }
    return null;
};

export const setUserData = (user: any) => {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem("user", JSON.stringify(user));
    }
};