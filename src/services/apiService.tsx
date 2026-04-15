import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://192.168.29.164:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

const getData = async (endpoint: string) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

const sendData = async (endpoint: string, data: any) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

export default {
  getData,
  sendData,
};
