import { NextPage } from "next";

const ErrorHandler: NextPage<{ statusCode: number }> = () => {
  if (typeof window !== "undefined") {
    window.location.assign("/oops");
  }
  return null;
};

ErrorHandler.getInitialProps = ({ res, err }) => {
  const statusCode = res?.statusCode || err?.statusCode || 500;
  return { statusCode };
};

export default ErrorHandler;
