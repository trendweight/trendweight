import { Box, Center, Flex, Grid, Image, Link, Text } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

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
    url: "https://www.withings.com/health-mate",
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
    url: "https://www.fitbit.com/",
  },
];

export const WorksWith = () => {
  return (
    <Grid
      gridArea="works"
      templateColumns="min-content min-content 1fr"
      templateAreas={{
        base: '"Text Text Text" "Withings Withings Withings" "Fitbit Fitbit Fitbit"',
        md: '"Withings Fitbit Text"',
      }}
      gap={6}
      alignItems="center"
    >
      {vendors.map((vendor) => (
        <Link
          href={vendor.url}
          gridArea={vendor.name}
          _hover={{ textDecoration: "none" }}
          target="_blank"
          key={vendor.name}
        >
          <Center
            boxSize={220}
            borderRadius={20}
            bg="gray.50"
            borderColor="gray.200"
            borderWidth={1}
            borderStyle="solid"
            _hover={{ backgroundColor: "gray.100" }}
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
        </Link>
      ))}
      <Box fontSize="1.2rem" gridArea="Text">
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
    </Grid>
  );
};
