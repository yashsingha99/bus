import axios from "axios";


type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  clerkId: string;
};

export const getUser = async (clerkId: string) => {
  const response = await axios.get(`/api/user/${clerkId}`);
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await axios.post(`/api/user`, user);
  return response.data;
};



