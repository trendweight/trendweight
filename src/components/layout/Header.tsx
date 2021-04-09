import React from "react";
import Logo from "~/components/shared/Logo";
import Menu from "./Menu";

const Header = () => {
  return (
    <header className="text-white bg-brand-500">
      <nav className="container flex flex-row items-center justify-between mx-auto px-0 md:px-4">
        <div className="flex flex-row flex-wrap items-center justify-between w-full">
          <div className="flex flex-row pl-2 py-2 md:pl-0">
            <div className="font-serif text-2xl font-bold leading-5">TrendWeight</div>
            <Logo height="32px" width="77.13px" />
          </div>
          <Menu />
        </div>
      </nav>
    </header>
  );
};

export default Header;
