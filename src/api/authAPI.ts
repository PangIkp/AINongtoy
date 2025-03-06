const API_URL = "http://localhost:3001/api/v1/auth";

const isEmail = (value: string): boolean => {
    // Regular Expression สำหรับตรวจสอบว่าเป็นอีเมลหรือไม่
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(value);
};

export const login = async (username: string, password: string) => {
    try {
        const body = isEmail(username)
            ? { email: username, password }
            : { username, password };

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        }); 

        const data = await response.json();
        console.log("Login API Response:", data); // ✅ Debug

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        localStorage.setItem("user", JSON.stringify(data.data)); // เก็บข้อมูล user
        localStorage.setItem("token", data.token); // เก็บ token

        console.log("Stored user in localStorage:", localStorage.getItem("user"));
        console.log("Stored token in localStorage:", localStorage.getItem("token"));

        return data; // ✅ ต้องแน่ใจว่า data มี user
    } catch (error: any) {
        throw new Error(error.message);
    }
};
