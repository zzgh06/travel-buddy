"use client";

import { useRouter } from "next/navigation";
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

  const onSubmit = async (data: SignUpFormData) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password
      }),
    });

    const result = await res.json();
    if (res.ok) {
      alert('회원가입에 성공하였습니다.');
      router.push("/login");
    } else {
      alert(result.error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block mb-2">Name</label>
        <input
          id="name"
          {...register("name", {
            required: "이름을 입력해주세요.",
            maxLength: {
              value: 10,
              message: "이름은 10자를 초과할 수 없습니다."
            }
          })}
          className="w-full p-2 border rounded"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
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
      <div>
        <label htmlFor="confirmPassword" className="block mb-2">Confirm Password</label>
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
          className="w-full p-2 border rounded"
        />
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" className="w-full p-2 bg-green-500 text-white rounded">회원가입</button>
    </form>
  )
}