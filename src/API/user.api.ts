import axios from "axios";

const URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

type User = {
  fullName: string;
  email: string;
  phoneNumber: string;
  clerkId: string;
};

export const getUser = async (clerkId: string) => {
  const response = await axios.get(`${URL}/api/user/${clerkId}`);
  return response.data;
};

export const createUser = async (user: User) => {
  const response = await axios.post(`${URL}/api/user`, user);
  return response.data;
};



