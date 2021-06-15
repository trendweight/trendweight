import { Spinner } from "@chakra-ui/react";
import { SpinnerProps } from "@chakra-ui/spinner";
import React, { FC } from "react";

const Loading: FC<SpinnerProps> = (props) => <Spinner color="gray.200" thickness="3px" {...props} />;

export default Loading;
