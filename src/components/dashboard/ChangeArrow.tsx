import { Icon } from "@chakra-ui/react";
import React, { FC } from "react";
import { ImArrowDown, ImArrowUp } from "react-icons/im";

const ChangeArrow: FC<{ change: number; intendedDirection?: number }> = ({ change, intendedDirection = 0 }) => {
  const arrow = change < 0 ? ImArrowDown : ImArrowUp;

  let color: string;
  if (intendedDirection === 0) {
    color = "gray.700";
  } else {
    color = change * intendedDirection > 0 ? "green.600" : "red.600";
  }

  return <Icon as={arrow} color={color} />;
};

export default ChangeArrow;
