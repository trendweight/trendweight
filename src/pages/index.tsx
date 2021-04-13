import React from "react";
import Banner from "~/components/home/Banner";
import Blurb from "~/components/home/Blurb";
import InfoButtons from "~/components/home/InfoButtons";
import SampleChart from "~/components/home/SampleChart";
import WorksWith from "~/components/home/WorksWith";
import Footer from "~/components/layout/Footer";
import { Page } from "~/lib/core/page";

const Home: Page = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />
      <div className="container relative flex-grow flex-shrink mx-auto p-4 md:py-6">
        <div className="grid-areas-home md:grid-areas-home-wide grid gap-6 grid-cols-1 md:gap-10 md:grid-cols-home">
          <InfoButtons />
          <Blurb />
          <SampleChart />
          <WorksWith />
        </div>
      </div>
      <Footer />
    </div>
  );
};

Home.bypassShell = true;
Home.title = "TrendWeight";

export default Home;
