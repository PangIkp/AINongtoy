const API_URL = "http://localhost:3001/api/v1/auth";

const isEmail = (value: string): boolean => {
    // Regular Expression สำหรับตรวจสอบว่าเป็นอีเมลหรือไม่
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(value);
};

export const login = async (username: string, password: string) => {
    try {
        // ตรวจสอบว่า username เป็นอีเมลหรือไม่
        const body = isEmail(username)
            ? { email: username, password }  // ถ้าเป็นอีเมล
            : { username, password };        // ถ้าเป็นชื่อผู้ใช้

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        return data; // ✅ ส่งข้อมูลกลับไปใช้ใน Login.tsx

    } catch (error: any) {
        throw new Error(error.message);
    }
};

