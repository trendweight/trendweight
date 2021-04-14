import clsx from "clsx";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Button from "~/components/forms/Button";
import ErrorMessage from "~/components/forms/ErrorMessage";
import Input from "~/components/forms/Input";
import Link from "~/components/shared/Link";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const Login: Page = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loginFailed, setLoginFailed] = useState<string | undefined>(undefined);
  const { handleSubmit, formState, register } = useForm();

  const { errors } = formState;

  const onSubmit = handleSubmit(async (values) => {
    try {
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
          <div className="max-w-[400px] flex flex-col my-4 w-full space-y-5 md:my-12 md:px-6 md:py-12 md:bg-gray-50 md:border md:border-gray-100 md:rounded-lg md:shadow-md">
            <h2 className="text-brand-600 text-xl font-bold">Log In</h2>
            <div>
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <Input
                {...register("email", {
                  required: "Please enter your email",
                })}
                id="email"
                type="email"
                placeholder="Email"
                isInvalid={errors.email}
              />
              <ErrorMessage>{errors?.email?.message}</ErrorMessage>
            </div>
            <div>
              <label className="sr-only" htmlFor="password">
                Password
              </label>
              <Input
                {...register("password", { required: "Please enter your password" })}
                id="password"
                type="password"
                placeholder="Password"
                isInvalid={errors.password}
              />
              <ErrorMessage>{errors?.password?.message}</ErrorMessage>
            </div>
            <div className="flex flex-row items-center space-x-2">
              <Button isLoading={formState.isSubmitting} type="submit">
                Log In
              </Button>
              <div>
                or <Link href="/signup">create an account</Link>
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

Login.title = "Log In";
Login.requireLogin = false;

export default Login;
