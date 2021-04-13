import { useRouter } from "next/router";
import Link from "~/components/shared/Link";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const Register: Page = () => {
  const auth = useAuth();
  const router = useRouter();
  if (auth.isInitializing || auth.user) {
    if (auth.user) {
      router.push("/dashboard");
    }
    return null;
  } else {
    return (
      <div className="flex items-center justify-center">
        <div className="max-w-[800px] flex flex-col my-4 w-full space-y-5 md:my-12 md:px-6 md:py-12 md:bg-gray-50 md:border md:border-gray-100 md:rounded-lg md:shadow-md">
          <h2 className="text-brand-600 text-xl font-bold">Create an Account</h2>
          <div>
            Registration for the beta version of TrendWeight is not available yet. If you are interested in being an
            early tester, email me at <Link href="mailto:erv@ewal.net?subject=Beta Testing">erv@ewal.net</Link>.
          </div>
          <div>
            If you just are interested in knowing when the beta is ready for general use, your best bet is to follow
            TrendWeight on <Link href="https://twitter.com/trendweight">Twitter</Link>,{" "}
            <Link href="https://facebook.com/trendweight">Facebook</Link>, or subscribe to the{" "}
            <Link href="https://blog.trendweight.com">Blog</Link>.
          </div>
          <div>
            In the mean time, you're welcome to use the live version of TrendWeight at{" "}
            <Link href="https://trendweight.com">trendweight.com</Link>.
          </div>
          <div className="flex flex-row items-center space-x-2">
            <Link href="/" variant="button" btnColor="brand">
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }
};

Register.title = "Sign Up";

export default Register;
