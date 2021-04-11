import { useCallback } from "react";
import { useAuth } from "~/lib/core/auth";
import { useDisclosure } from "~/lib/core/utils";
import MenuItem from "./MenuItem";

const Menu = () => {
  const { isOpen, toggle, close } = useDisclosure();
  const auth = useAuth();
  const handleSignOut = useCallback(() => {
    auth.signOut();
  }, [auth]);

  if (auth.isInitializing) {
    return null;
  }

  const isLoggedIn = !!auth?.user;

  return (
    <>
      <div className="block pr-4 md:hidden" onClick={toggle}>
        <svg fill="white" width="1em" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </div>

      <div
        className={`flex-col md:flex-row bg-white md:bg-transparent ${
          isOpen ? "block" : "hidden"
        } md:flex self-stretch items-stretch w-full md:w-auto shadow-md md:shadow-none py-2 md:py-0`}
        onClick={close}
      >
        <MenuItem href="/">Home</MenuItem>
        <MenuItem href="/dashboard" show={isLoggedIn}>
          Dashboard
        </MenuItem>
        <MenuItem href="/settings" show={isLoggedIn}>
          Settings
        </MenuItem>
        <MenuItem href="/about">About</MenuItem>
        <MenuItem href="/register" show={!isLoggedIn}>
          Register
        </MenuItem>
        <MenuItem href="/login" show={!isLoggedIn}>
          Sign In
        </MenuItem>
        <MenuItem onClick={handleSignOut} show={isLoggedIn}>
          Sign Out
        </MenuItem>
      </div>
    </>
  );
};

export default Menu;
