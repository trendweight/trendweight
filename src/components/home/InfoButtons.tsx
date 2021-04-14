import React from "react";
import { useAuth } from "~/lib/core/auth";
import Link from "../shared/Link";

const InfoButtons = () => {
  const { isInitializing, user } = useAuth();

  return (
    <div className="grid-in-buttons flex flex-col items-center w-full space-y-4 md:flex-row md:space-x-4 md:space-y-0">
      <Link href="/about" variant="button" btnColor="green" size="xl">
        Learn More
      </Link>
      {!isInitializing && !user ? (
        <>
          <Link href="/signup" variant="button" btnColor="brand" size="xl">
            Create an Account
          </Link>
          <Link href="/login" variant="button" btnColor="brand" size="xl">
            Log In
          </Link>
        </>
      ) : (
        !isInitializing && (
          <Link href="/dashboard" variant="button" btnColor="brand" size="xl">
            Go To Dashboard
          </Link>
        )
      )}
    </div>
  );
};

export default InfoButtons;
