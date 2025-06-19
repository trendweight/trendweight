import { Box } from "@chakra-ui/react";
import Image from "next/image";
import { FC } from "react";
import chart from "../../public/assets/chart-home.png";
import { HomeWidgetProps } from "./MainContent";

const SampleChart: FC<HomeWidgetProps> = ({ area }) => (
  <Box gridArea={area} position="relative">
    <Image
      src={chart}
      placeholder="blur"
      alt="sample chart"
      sizes="100vw"
      style={{
        width: "100%",
        height: "auto",
        objectFit: "contain",
      }}
    />
  </Box>
);

export default SampleChart;
