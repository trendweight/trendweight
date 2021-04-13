import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import React from "react";

const vendors = [
  {
    name: "Withings",
    logoText: "WITHINGS",
    app: {
      src: "/assets/withings-app.png",
      height: 140,
      width: 128,
    },
    className: "font-medium text-3xl tracking-wider",
    url: "https://www.withings.com/health-mate",
  },
  {
    name: "Fitbit",
    logoText: "fitbit",
    app: {
      src: "/assets/fitbit-app.png",
      height: 140,
      width: 128,
    },
    className: "font-normal text-4xl",
    url: "https://www.fitbit.com/sg/app",
  },
];

const WorksWith = () => {
  return (
    <div className="grid-in-works flex flex-col flex-wrap items-center md:flex-row md:space-x-4">
      {vendors.map((vendor) => (
        <a
          target="_blank"
          key={vendor.name}
          href={vendor.url}
          rel="noreferrer"
          className="order-2 pb-6 w-full md:pr-6 md:w-auto"
        >
          <div className="flex items-center justify-center w-56 h-56 hover:bg-gray-100 bg-gray-50 border border-gray-200 rounded-2xl">
            <div className="flex flex-col items-center p-1">
              <Image
                src={vendor.app.src}
                layout="fixed"
                objectFit="contain"
                alt={`${vendor.name} app logo`}
                height={vendor.app.height}
                width={vendor.app.width}
                className=""
              />
              <div className="flex flex-col items-center leading-none">
                <div className="text-brand-500 font-bold">Works with</div>
                <div className={vendor.className}>{vendor.logoText}</div>
              </div>
            </div>
          </div>
        </a>
      ))}
      <div className="order-1 pb-6 text-xl md:order-3">
        <div className="font-bold">Enter your daily weight how you like...</div>
        <div>
          <FontAwesomeIcon icon="check" color="green" /> Smart Scales / WiFi Scales
        </div>
        <div>
          <FontAwesomeIcon icon="check" color="green" /> Withings Health Mate App
        </div>
        <div>
          <FontAwesomeIcon icon="check" color="green" /> Fitbit App
        </div>
      </div>
    </div>
  );
};

export default WorksWith;
