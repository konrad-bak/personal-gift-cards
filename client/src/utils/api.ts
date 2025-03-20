import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8080'; // Server API URL

export interface UserData {
  username: string;
  email: string;
  password: string;
}

export interface Credentials {
  email: string | FormDataEntryValue;
  password: string | FormDataEntryValue;
}

export interface CardData {
  title: string;
  content: string;
  owner: string;
  recipients: string[];
  imageUrl?: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  username: string;
}

const api = {
  registerUser: async (userData: UserData): Promise<any> => {
    try {
      const response: AxiosResponse = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      console.log('Register User Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Register User Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  loginUser: async (credentials: Credentials): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      console.log('Login User Response:', response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId);
      return response.data;
    } catch (error: any) {
      console.error(
        'Login User Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  logoutUser: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');

    console.log('User logged out.');
  },

  deleteUser: async (userId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse = await axios.delete(
        `${API_BASE_URL}/auth/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Delete User Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Delete User Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  createCard: async (cardData: CardData): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse = await axios.post(
        `${API_BASE_URL}/cards`,
        cardData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Create Card Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Create Card Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  getUserCards: async (userId: string): Promise<any[]> => {
    if (!userId) {
      console.log('userId empty.');
      return [];
    }
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse<any[]> = await axios.get(
        `${API_BASE_URL}/cards/users/${userId}/cards`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Get User Cards Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Get User Cards Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  sendCard: async (cardId: string, recipientId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse = await axios.put(
        `${API_BASE_URL}/cards/send/${cardId}/${recipientId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Send Card Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Send Card Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  deleteCard: async (cardId: string, userId: string): Promise<any> => {
    try {
      const token = localStorage.getItem('token');
      const response: AxiosResponse = await axios.delete(
        `${API_BASE_URL}/cards/delete/${cardId}/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log('Delete Card Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(
        'Delete Card Error:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};

export default api;
