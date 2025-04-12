import axios from "axios";


type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dob: string;
};

export const createUser = async (user: User) => {
  const response = await axios.post(`/api/auth`, user);
  return response.data;
};

export const login = async (user: User) => {
  const response = await axios.post(`/api/auth/check`, user);
  return response.data;
};

