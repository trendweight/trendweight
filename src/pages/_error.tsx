import { NextPage } from "next";

const ErrorHandler: NextPage = () => {
  if (typeof window !== "undefined") {
    window.location.assign("/oops");
  }
  return null;
};

ErrorHandler.getInitialProps = (_context) => {
  return {};
};

export default ErrorHandler;
