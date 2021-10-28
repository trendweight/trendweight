import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";
import chart from "../../../public/assets/chart-home.png";
import { HomeWidgetProps } from "./MainContent";

const SampleChart: FC<HomeWidgetProps> = ({ area }) => (
  <Box gridArea={area} position="relative">
    <Image src={chart} placeholder="blur" layout="responsive" objectFit="contain" alt="sample chart" />
  </Box>
);

export default SampleChart;
