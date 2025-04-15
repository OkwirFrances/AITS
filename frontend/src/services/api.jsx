
import axios from 'axios';
import { getToken, clearToken, storeToken } from '../pages/Auth/auth';

const API_BASE_URL = 'https://aits-api.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          clearToken();
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await refreshAccessToken(refreshToken);
        const newAccessToken = response.data.access;
        storeToken(newAccessToken);
        
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearToken();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  signup: async (email, fullname, password, role) => {
    try {
      const response = await api.post('/signup/', { email, fullname, password, role });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyOTP: async (email, otp) => {
    try {
      const response = await api.post('/verify-otp/', { email, otp });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  login: async (email, password) => {
    try {
      const response = await api.post('/login/', { email, password });
      storeToken(response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resendOTP: async (email) => {
    try {
      const response = await api.post('/resend-otp/', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  refreshAccessToken: async (refreshToken) => {
    try {
      const response = await api.post('/token/refresh/', { refresh: refreshToken });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    clearToken();
    localStorage.removeItem('refreshToken');
  },
};

// User API
export const userAPI = {
  getUserInfo: async () => {
    try {
      const response = await api.get('/user-info/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateUserInfo: async (userData) => {
    try {
      const response = await api.put('/user-info/edit/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Department API
export const departmentAPI = {
  getDepartments: async () => {
    try {
      const response = await api.get('/departments/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createDepartment: async (departmentData) => {
    try {
      const response = await api.post('/departments/', departmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Course API
export const courseAPI = {
  getCourses: async () => {
    try {
      const response = await api.get('/courses/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // getStudentCourses: async () => {
  //   try {
  //     const response = await api.get('/courses/student-courses/');
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },

  getCourseDetail: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // getCourseLecturers: async (courseId) => {
  //   try {
  //     const response = await api.get(`/courses/${courseId}/lecturers/`);
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },

  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses/', courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateCourse: async (courseId, courseData) => {
    try {
      const response = await api.put(`/courses/${courseId}/`, courseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/courses/${courseId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Lecturer API
export const lecturerAPI = {
  getLecturers: async () => {
    try {
      const response = await api.get('/lecturers/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
 
  createLecturer: async (lecturerData) => {
    try {
      const response = await api.post('/lecturers/', lecturerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getLecturerIssues: async () => {
    try {
      const response = await api.get('/lecturers/issues/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateLecturer: async (lecturerId, lecturerData) => {
    try {
      const response = await api.put(`/lecturers/${lecturerId}/`, lecturerData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

// Issue API
export const issueAPI = {
  getIssues: async () => {
    try {
      const response = await api.get('/issues/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // getStudentIssues: async () => {
  //   try {
  //     const response = await api.get('/issues/student/');
  //     return response.data;
  //   } catch (error) {
  //     throw error.response?.data || error.message;
  //   }
  // },

  getIssueDetail: async (issueId) => {
    try {
      const response = await api.get(`/issues/${issueId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createIssue: async (issueData) => {
    try {
      const response = await api.post('/issues/', issueData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateIssue: async (issueId, issueData) => {
    try {
      const response = await api.put(`/issues/${issueId}/`, issueData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteIssue: async (issueId) => {
    try {
      const response = await api.delete(`/issues/${issueId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  assignIssue: async (issueId, lecturerId) => {
    try {
      const response = await api.post(`/issues/${issueId}/assign/${lecturerId}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  resolveIssue: async (issueId) => {
    try {
      const response = await api.post(`/issues/${issueId}/resolve/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default api;