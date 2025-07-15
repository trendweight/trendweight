import { Link } from "@tanstack/react-router";
import { useAuth } from "../../lib/auth/useAuth";

export function InfoButtons() {
  const { isInitializing, isLoggedIn } = useAuth();
  const visibility = isInitializing ? "invisible" : "visible";

  return (
    <div className="flex w-full flex-col items-center gap-4 md:flex-row">
      <Link
        to="/about"
        className="w-full rounded bg-green-600 px-6 py-6 text-center text-xl font-normal text-white transition-colors hover:bg-green-700 md:w-80 md:py-7 lg:text-2xl"
      >
        Learn More
      </Link>
      {isLoggedIn ? (
        <Link
          to="/dashboard"
          className={`bg-brand-600 hover:bg-brand-700 w-full rounded px-6 py-6 text-center text-xl font-normal text-white transition-colors md:w-80 md:py-7 lg:text-2xl ${visibility}`}
        >
          Go To Dashboard
        </Link>
      ) : (
        <Link
          to="/login"
          className={`bg-brand-600 hover:bg-brand-700 w-full rounded px-6 py-6 text-center text-xl font-normal text-white transition-colors md:w-80 md:py-7 lg:text-2xl ${visibility}`}
        >
          Log In / Sign Up
        </Link>
      )}
    </div>
  );
}
