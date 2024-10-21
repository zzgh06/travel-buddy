"use client";

import LoginSkeleton from "@/components/skeleton/LoginSkeleton";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BiLogIn } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";

type SignInFormData = {
  email: string;
  password: string;
};

export default function Login() {
  const { status } = useSession();
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const onSubmit = async (data: SignInFormData) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      alert(result.error);
    } else {
      router.push("/");
      router.refresh();
    }
  }
  const handleSignUp = () => {
    router.push('/signup')
  }

  if (status === 'loading') {
    return <LoginSkeleton />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            로그인하여 여행 계획을 만들어 보세요
          </p>
        </div>
        <form data-cy="login-form" onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <input
                  data-cy="email"
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "이메일을 입력해주세요.",
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: "유효한 이메일 주소를 입력해주세요."
                    }
                  })}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                  placeholder="이메일 주소"
                />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <input
                  data-cy="password"
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "비밀번호를 입력해주세요.",
                    minLength: {
                      value: 5,
                      message: "비밀번호는 5자 이상이어야 합니다."
                    }
                  })}
                  className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-300 ease-in-out"
                  placeholder="비밀번호"
                />
              </div>
              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <button
              data-cy="login-submit-button"
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <BiLogIn className="h-5 w-5 mr-2" />
              로그인
            </button>

            <button
              data-cy="register-submit-button"
              onClick={handleSignUp}
              type="button"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-300 ease-in-out"
            >
              <BiLogIn className="h-5 w-5 mr-2" />
              회원가입
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={() => signIn("google")}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-300 ease-in-out"
            >
              <FcGoogle className="w-5 h-5 mr-3" />
              Google로 로그인
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}