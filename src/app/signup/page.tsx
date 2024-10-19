"use client";

import { useSignUp } from "@/hooks/useSignUpQueries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function SignUp() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>();
  const router = useRouter();
  const signUpMutation = useSignUp();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const onSubmit = async (data: SignUpFormData) => {
    try {
      await signUpMutation.mutateAsync({
        name: data.name,
        email: data.email,
        password: data.password
      });
      alert('회원가입에 성공하였습니다.');
      router.push("/login");
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            여행 계획을 만들기 위해 회원가입을 해주세요
          </p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Name</label>
              <input
                id="name"
                {...register("name", {
                  required: "이름을 입력해주세요.",
                  maxLength: {
                    value: 10,
                    message: "이름은 10자를 초과할 수 없습니다."
                  }
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이름"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "유효한 이메일 주소를 입력해주세요."
                  }
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="이메일 주소"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                type="password"
                {...register("password", {
                  required: "비밀번호를 입력해주세요.",
                  minLength: {
                    value: 5,
                    message: "비밀번호는 5자 이상이어야 합니다."
                  }
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword", {
                  required: "비밀번호를 다시 입력해주세요.",
                  validate: (val: string) => {
                    if (watch('password') != val) {
                      return "비밀번호가 일치하지 않습니다.";
                    }
                  }
                })}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="비밀번호 확인"
              />
            </div>
          </div>

          {(errors.name || errors.email || errors.password || errors.confirmPassword || errorMessage) && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mt-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">입력 오류가 있습니다:</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {errors.name && <li>{errors.name.message}</li>}
                      {errors.email && <li>{errors.email.message}</li>}
                      {errors.password && <li>{errors.password.message}</li>}
                      {errors.confirmPassword && <li>{errors.confirmPassword.message}</li>}
                      {errorMessage && <li>{errorMessage}</li>}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={signUpMutation.isPending}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-300 ease-in-out ${
                signUpMutation.isPending ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {signUpMutation.isPending ? '처리 중...' : '회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}