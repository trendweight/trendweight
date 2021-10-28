import { Box, Center, Icon, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { FC } from "react";
import { FaCheck } from "react-icons/fa";
import fitbitAppLogo from "../../../public/assets/fitbit-app.png";
import withingsAppLogo from "../../../public/assets/withings-app.png";
import Link from "../shared/components/Link";
import { HomeWidgetProps } from "./MainContent";

const vendors = [
  {
    name: "Withings",
    logoText: "WITHINGS",
    app: {
      logo: withingsAppLogo,
      height: 140,
      width: 128,
    },
    boxProps: {
      fontWeight: "medium",
      fontSize: "3xl",
      letterSpacing: "wider",
    },
    url: "https://www.withings.com/health-mate",
  },
  {
    name: "Fitbit",
    logoText: "fitbit",
    app: {
      logo: fitbitAppLogo,
      height: 140,
      width: 128,
    },
    boxProps: {
      fontWeight: "normal",
      fontSize: "4xl",
    },
    url: "https://www.fitbit.com/sg/app",
  },
];

const WorksWith: FC<HomeWidgetProps> = ({ area }) => {
  return (
    <Stack
      gridArea={area}
      direction={{ base: "column", md: "row" }}
      wrap="wrap"
      alignItems={{ base: "unset", md: "center" }}
      // justifyContent={{ base: "center", md: "unset" }}
      spacing={4}
    >
      {vendors.map((vendor) => (
        <Link key={vendor.name} href={vendor.url} w={{ base: "full", md: "auto" }} order={2} pr={{ md: 6 }} color="black" _hover={{ textDecoration: "none" }}>
          <Center boxSize={56} bg="gray.50" _hover={{ bg: "gray.100" }} borderWidth={1} borderColor="gray.200" rounded="2xl">
            <Stack direction="column" alignItems="center" p={1}>
              <Image
                src={vendor.app.logo}
                layout="fixed"
                objectFit="contain"
                alt={`${vendor.name} app logo`}
                height={vendor.app.height}
                width={vendor.app.width}
              />
              <Stack direction="column" alignItems="center" lineHeight={1} spacing={0}>
                <Text color="brand.500" fontWeight="bold">
                  Works with
                </Text>
                <Box {...vendor.boxProps}>{vendor.logoText}</Box>
              </Stack>
            </Stack>
          </Center>
        </Link>
      ))}
      <Box order={{ base: 1, md: 3 }} pt={{ md: 6 }} pb={6} fontSize="xl">
        <Box fontWeight="bold">Enter your daily weight how you like...</Box>
        <Box>
          <Icon as={FaCheck} color="green.500" /> Smart Scales / WiFi Scales
        </Box>
        <Box>
          <Icon as={FaCheck} color="green.500" /> Withings Health Mate App
        </Box>
        <Box>
          <Icon as={FaCheck} color="green.500" /> Fitbit App
        </Box>
      </Box>
    </Stack>
  );
};

export default WorksWith;
