import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      const { data } = await axios.post('/api/auth/register', userData);
      return data;
    },
    onError: (error: any) => {
      console.error('Sign up error:', error.response?.data?.error || error.message);
      throw new Error(error.response?.data?.error || '회원가입에 실패했습니다.');
    },
  });
};