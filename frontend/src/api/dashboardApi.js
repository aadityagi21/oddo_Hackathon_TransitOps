import axiosInstance from './axiosInstance';

export const checkHealth = async () => {
  const { data } = await axiosInstance.get('/health');
  return data;
};
