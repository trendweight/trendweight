import React from "react";
import { useAuth } from "~/lib/core/auth";
import Link from "../shared/Link";

const InfoButtons = () => {
  const { isInitializing, user } = useAuth();

  const getStartedUrl = isInitializing || !user ? "/register" : "/dashboard";

  return (
    <div className="grid-in-buttons flex flex-col gap-4 items-center w-full md:flex-row">
      <Link href="/about" variant="button" btnColor="green" size="xl">
        Learn More
      </Link>
      {!isInitializing && !user ? (
        <>
          <Link href="/register" variant="button" btnColor="brand" size="xl">
            Register
          </Link>
          <Link href="/login" variant="button" btnColor="brand" size="xl">
            Sign In
          </Link>
        </>
      ) : (
        <Link href="/dashboard" variant="button" btnColor="brand" size="xl">
          Go To Dashboard
        </Link>
      )}
    </div>
  );
};

export default InfoButtons;
