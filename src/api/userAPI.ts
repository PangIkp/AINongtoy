import axios from 'axios';

const API_URL = "http://localhost:3001/api/v1/user";

export const updateUserProfile = async (userId: string, userData: any) => {
    try {
        console.log('Updating user profile:', userId, userData); // Log request details
        const response = await axios.patch(`${API_URL}/${userId}`, userData);
        console.log('API Response:', response.data); // Log response data
        return response.data;
    } catch (error: any) {
        console.error('API Error Data:', error.response?.data); // Log error response data
        console.error('Fetch Error:', error); // Log full error
        throw new Error(error.response?.data?.error || 'Failed to update profile');
    }
};
