import api from './axios';

// get all
export const getAllBooks = async () => {
    return await api.get('/book/all');
};

// search book
export const searchBooks = async (query, page = 1, limit = 5) => {
    return await api.get(`/book/search?n=${query}&page=${page}&limit=${limit}`);
};

// get book by title
export const getBookByTitle = (title) => api.get(`/book/by-title?title=${title}`);

// add book
export const addBook = async (data) => {
    return await api.post('/book', data);
};

// delete by title
export const deleteByTitle = (title) => api.delete(`/book/by-title?title=${title}`);



