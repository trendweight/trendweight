import { Box, Center, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export const WorksWith = () => {
  const vendors = [
    {
      name: "Withings",
      app: {
        src: "/assets/withings-app.png",
        height: 140,
        width: 128,
      },
      logo: {
        src: "/assets/withings-logo.png",
        height: 18,
        width: "auto",
      },
      url: "",
    },
    {
      name: "Fitbit",
      app: {
        src: "/assets/fitbit-app.png",
        height: 140,
        width: 128,
      },
      logo: {
        src: "/assets/fitbit-logo.png",
        height: 24.01,
        width: "auto",
      },
      url: "",
    },
  ];

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={6}
      align="center"
      // justify="center"
      width="100%"
      gridArea="works"
    >
      {vendors.map((vendor) => (
        <Center
          boxSize={220}
          borderRadius={20}
          bg="gray.50"
          borderColor="gray.200"
          borderWidth={1}
          borderStyle="solid"
          key={vendor.name}
        >
          <Flex direction="column" align="center" p={1}>
            <Image
              src={vendor.app.src}
              alt={`${vendor.name} app logo`}
              height={vendor.app.height}
              width={vendor.app.width}
              pb={3}
            />
            <Flex direction="column">
              <Text fontSize="16px" fontWeight="bold">
                Works with
              </Text>
              <Image src={vendor.logo.src} alt={vendor.name} height={vendor.logo.height} width={vendor.logo.width} />
            </Flex>
          </Flex>
        </Center>
      ))}
      <Box fontSize="1.2rem">
        <Box fontWeight="bold">Enter your daily weight how you like...</Box>
        <Box>
          <FontAwesomeIcon icon="check" color="green" /> Smart Scales / WiFi Scales
        </Box>
        <Box>
          <FontAwesomeIcon icon="check" color="green" /> Withings Health Mate App
        </Box>
        <Box>
          <FontAwesomeIcon icon="check" color="green" /> Fitbit App
        </Box>
      </Box>
    </Stack>
  );
};
