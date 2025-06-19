import { Spinner, SpinnerProps } from "@chakra-ui/react";
import React, { FC } from "react";

const Loading: FC<SpinnerProps> = (props) => <Spinner color="gray.200" thickness="3px" {...props} />;

export default Loading;
