import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:8000/api/', // Adjust according to actual backend address
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// User related API
export const userAPI = {
  getUsers: () => api.get('users/'),
  getUser: (id) => api.get(`users/${id}/`),
  createUser: (data) => api.post('users/', data),
  updateUser: (id, data) => api.put(`users/${id}/`, data),
  deleteUser: (id) => api.delete(`users/${id}/`),
};

// Program related API
export const programAPI = {
  getPrograms: () => api.get('programs/'),
  getProgram: (id) => api.get(`programs/${id}/`),
  createProgram: (data) => api.post('programs/', data),
  updateProgram: (id, data) => api.put(`programs/${id}/`, data),
  deleteProgram: (id) => api.delete(`programs/${id}/`),
};

// Question related API
export const questionAPI = {
  getQuestions: () => api.get('questions/'),
  getQuestion: (id) => api.get(`questions/${id}/`),
  createQuestion: (data) => api.post('questions/', data),
  updateQuestion: (id, data) => api.put(`questions/${id}/`, data),
  deleteQuestion: (id) => api.delete(`questions/${id}/`),
};

// Learning record related API
export const learnAPI = {
  getLearns: () => api.get('learns/'),
  getLearn: (id) => api.get(`learns/${id}/`),
  createLearn: (data) => api.post('learns/', data),
  updateLearn: (id, data) => api.put(`learns/${id}/`, data),
  deleteLearn: (id) => api.delete(`learns/${id}/`),
};

// Solve related API
export const solveAPI = {
  getSolves: () => api.get('solves/'),
  getSolve: (id) => api.get(`solves/${id}/`),
  createSolve: (data) => api.post('solves/', data),
  updateSolve: (id, data) => api.put(`solves/${id}/`, data),
  deleteSolve: (id) => api.delete(`solves/${id}/`),
};

export default api; 