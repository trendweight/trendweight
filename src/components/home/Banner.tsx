import React from "react";
import Logo from "~/components/shared/Logo";

const Banner = () => {
  return (
    <header className="text-white bg-brand-500">
      <div className="container flex flex-row flex-wrap items-center justify-between mx-auto px-4 py-14">
        <div className="flex flex-col space-y-1">
          <div className="flex flex-row items-center">
            <div className="pr-2 font-serif text-4xl font-bold leading-5 md:text-6xl">TrendWeight</div>
            <Logo className="w-[77.13px] h-[32px] md:w-[115.7px] md:h-[48px]" />
          </div>
          <div className="text-xl md:text-xl">
            Automated Weight Tracking<span className="hidden md:inline">, Hacker's Diet Style</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Banner;
