import React, { FC } from "react";

interface LoadingProps extends Pick<SpinnerProps, "size"> {
  subtle?: boolean;
  className?: string;
}

const Loading: FC<LoadingProps> = ({ size = "xl", subtle = true, className }) => {
  const thickness = size === "xl" ? "6px" : size === "lg" ? "4px" : undefined;
  const colors = subtle ? { emptyColor: "gray.50", color: "gray.100" } : { emptyColor: "gray.100", color: "gray.300" };
  return <Spinner thickness={thickness} speed="0.85s" size={size} className={className} {...colors} />;
};

export default chakra(Loading);
