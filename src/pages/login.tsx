import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "~/components/shared/Button";
import Link from "~/components/shared/Link";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const Login: Page = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loginFailed, setLoginFailed] = useState<string | undefined>(undefined);
  const { handleSubmit, errors, register, formState } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log(values);
      await auth.signInWithPassword(values.email, values.password);
      setLoginFailed(undefined);
    } catch (error) {
      setLoginFailed(error.code);
    }
  });

  if (auth.isInitializing || auth.user) {
    if (auth.user) {
      router.push("/dashboard");
    }
    return null;
  } else {
    return (
      <form onSubmit={onSubmit}>
        <div className="flex items-center justify-center">
          <div className="flex flex-col space-y-6 md:border-gray-100 md:bg-gray-50 md:border md:rounded-lg max-w-[400px] md:px-6 md:py-12 my-4 md:my-12 md:shadow-md w-full">
            <h2 className="text-xl font-bold text-brand-500">Sign In</h2>
            {/* <FormControl id="email" isInvalid={errors.email}> */}
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Email"
              className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full border-gray-300 rounded-md"
              ref={register({
                required: "Please enter your email",
              })}
            />
            {/* <FormErrorMessage>{errors?.email?.message}</FormErrorMessage> */}
            {/* <FormControl id="password" isInvalid={errors.password}> */}
            <label className="sr-only" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Password"
              ref={register({ required: "Please enter your password" })}
            />
            {/* <FormErrorMessage>{errors?.password?.message}</FormErrorMessage> */}
            <div className="flex flex-row space-x-4 items-center">
              <Button isLoading={formState.isSubmitting} type="submit">
                Sign In
              </Button>
              <div>
                or <Link href="/register">create an account</Link>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <Link href="">forgot your password?</Link>
              <div className={clsx("text-red-600", { hidden: !loginFailed })}>Invalid email or password</div>
            </div>
          </div>
        </div>
      </form>
    );
  }
};

Login.title = "Sign In";
Login.requireLogin = false;

export default Login;
