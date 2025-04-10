import axios from 'axios';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  name: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const authApi = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/login`, data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/auth/register`, data);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${API_URL}/auth/logout`);
    localStorage.removeItem('token');
  }
}; 