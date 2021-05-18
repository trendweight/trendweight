import { Box } from "@chakra-ui/layout";
import Image from "next/image";
import { FC } from "react";
import { HomeWidgetProps } from "./MainContent";

const SampleChart: FC<HomeWidgetProps> = ({ area }) => (
  <Box gridArea={area} position="relative">
    <Image src="/assets/chart-home.png" layout="responsive" objectFit="contain" height={894} width={1706} />
  </Box>
);

export default SampleChart;
