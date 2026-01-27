import api from './axios';

export const loginUser = async (email, password) => {
    return await api.post('/user/login', { email, password });
};

export const registerUser = async (userData) => {
    return await api.post('/user/register', userData);
};

export const getMyBooks = async () => {
    return await api.get('/user/my-books');
};

export const issueBook = async (bookId) => {
    return await api.post(`/user/issue/${bookId}`);
};

export const returnBook = async (bookId) => {
    return await api.post(`/user/return/${bookId}`);
};

export const getAllUsers = async () => {
    return await api.get('/user/all');
};

// OTP & Password Reset
export const sendOtp = async (email) => {
    return await api.post('/otp/send-otp', { email });
};

export const verifyOtp = async (email, otp) => {
    return await api.post('/otp/verify-otp', { email, otp });
};

export const resetPasswordApi = async (email, otp, newPassword) => {
    return await api.post('/otp/reset-password', { email, otp, newPassword });
};

export const deleteUserAccount = async (data) => {
    return await api.post('/user/delete', data);
};
