"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";

type SignInFormData = {
  email: string;
  password: string;
};

export default function Login(){
  const { register, handleSubmit, formState: { errors } } = useForm<SignInFormData>();
  const router = useRouter();


  const onSubmit  = async (data: SignInFormData) => {
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      alert(result.error);
    } else {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email" className="block mb-2">Email</label>
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
          className="w-full p-2 border rounded"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block mb-2">Password</label>
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
          className="w-full p-2 border rounded"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">로그인</button>
      <button onClick={() => signIn("google")} className="w-full p-2 bg-red-500 text-white rounded">Google로 로그인</button>
    </form>
  )
}