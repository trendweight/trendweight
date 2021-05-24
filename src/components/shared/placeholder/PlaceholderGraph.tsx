import clsx from "clsx";
import React, { FC } from "react";

export interface PlaceholderGraphProps {
  height?: number;
  width?: number;
  active?: boolean;
}

const PlaceholderGraph: FC<PlaceholderGraphProps> = ({ width, height = 200, active, ...rest }) => {
  const styles = { width: width || "100%", height };
  return (
    <div {...rest} className={clsx("placeholder placeholder-graph", { "placeholder-active": active })} style={styles} />
  );
};
PlaceholderGraph.displayName = "PlaceholderGraph";

export default PlaceholderGraph;
