import Link from "next/link";
import React, { useEffect } from "react";
import Layout from "../components/Layout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signIn, useSession } from "next-auth/react";
import { getError } from "../utils/Error";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

const schema = yup.object({
  email: yup
    .string()
    .email("Must be a valid email.")
    .required("Email Address is required."),
  password: yup
    .string()
    .required("Password is required.")
    .min(6, "Password must be at least 8 characters long."),
  // .matches(//),
});

export default function LoginScreen() {
  const { data: session } = useSession;

  const router = useRouter();
  console.log(router.query);
  const { redirect } = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || "/");
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onBlur", resolver: yupResolver(schema) });

  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title='Login'>
      <form
        className='mx-auto max-w-screen-md'
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className='mb-4 text-xl'>Login</h1>
        <div className='mb-4'>
          <label htmlFor='email'>Email</label>
          <input
            type='text'
            className='w-full'
            id='email'
            autoFocus
            autoComplete='email'
            {...register("email")}
          />
          {errors.email && (
            <div className='text-red-500'>{errors.email.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <label htmlFor='password'>Password</label>
          <input
            type='password'
            className='w-full'
            id='password'
            autoComplete='password'
            {...register("password")}
          />
          {errors.password && (
            <div className='text-red-500'>{errors.password.message}</div>
          )}
        </div>
        <div className='mb-4'>
          <button className='primary-button'>Login</button>
        </div>
        <div className='mb-4'>
          Don&apos;t have an account? &nbsp;
          <Link href='/register'>Register now.</Link>
        </div>
      </form>
    </Layout>
  );
}
