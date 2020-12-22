import { Box, Button, Center, Flex, Grid, Heading, Image, Stack, Text, useBreakpointValue } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import Footer from "~/components/Footer";
import { ResponsiveContainer } from "~/components/ResponsiveContainer";
import { useAuth } from "~/lib/auth";

const MotionImage = motion.custom(Image);

const Home = () => {
  const auth = useAuth();
  return (
    <>
      <Flex direction="column" minH="100vh">
        <Header />
        <Box flexGrow={1} flexShrink={1} position="relative">
          <ResponsiveContainer px={{ base: 4, md: 4 }}>
            <Grid
              templateColumns="2fr 3fr"
              templateAreas={{
                base: '"blurb blurb" "buttons buttons" "chart chart" "works works" "evolution evolution"',
                md: '"buttons buttons" "blurb chart" "works works" "evolution evolution"',
              }}
            >
              <InfoButtons />
              <Blurb />
              <Chart />
              <WorksWith />
            </Grid>
          </ResponsiveContainer>
        </Box>
        <Footer />
      </Flex>
    </>
  );
};

const Header = () => {
  const isNarrow = useBreakpointValue({ base: true, md: false });
  return (
    <Box as="nav" bg="brand.500" color="white">
      <ResponsiveContainer
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        px={{ base: 4, md: 4 }}
        py={12}
      >
        <Flex direction={"column"}>
          <Flex direction={"row"} align="center">
            <Text
              fontFamily="'Zilla Slab', serif"
              fontWeight="700"
              fontSize={{ base: "42px", md: "64px" }}
              pr={2}
              lineHeight={1.2}
            >
              TrendWeight
            </Text>
            <Image
              src="/assets/logo-line.svg"
              height={{ base: "32px", md: "48px" }}
              width={{ base: "77.13px", md: "115.7px" }}
            />
          </Flex>
          <Text fontSize={{ base: "20px", md: "22px" }}>
            Automated Weight Tracking{isNarrow ? null : ", Hacker's Diet Style"}
          </Text>
        </Flex>
      </ResponsiveContainer>
    </Box>
  );
};

const InfoButtons = () => (
  <Stack
    direction={{ base: "column", md: "row" }}
    spacing={4}
    align="center"
    // justify="center"
    width="100%"
    gridArea="buttons"
    py={10}
  >
    <Link href="/about">
      <Button
        colorScheme="green"
        fontSize={{ base: 22, md: 24 }}
        fontWeight="normal"
        width={{ base: "100%", md: "450px" }}
        p={{ base: 6, md: 7 }}
      >
        Learn More
      </Button>
    </Link>
    <Button
      colorScheme="brand"
      fontSize={{ base: 22, md: 24 }}
      fontWeight="normal"
      width={{ base: "100%", md: "450px" }}
      p={{ base: 6, md: 7 }}
    >
      Go To Dashboard
    </Button>
  </Stack>
);

const Blurb = () => (
  <Center gridArea="blurb" pr={{ md: 6 }} pb={{ md: 6 }} pt={{ base: 6, md: 0 }}>
    <Box>
      <Heading fontSize="1.6rem" pb={4}>
        Am I losing weight?
      </Heading>
      <Text pb={4}>TrendWeight can help answer that question by analyzing your day to day weight changes</Text>
      <Text pb={4}>
        <Text as="b">Step 1</Text>: Weigh yourself every day.
        <br />
        <Text as="b">Step 2</Text>: There is no Step 2!
      </Text>
      <Text>
        Losing weight is hard. Don't beat yourself just because your weight is higher today than it was yesterday. Our
        weight fluxuates—it just does. That's completely normal. TrendWeight is a tool that helps you focus on your
        weight <i>trend</i> over time instead of day to day changes.
      </Text>
    </Box>
  </Center>
);

const Chart = () => (
  <Center gridArea="chart" pb={{ base: 4, md: 12 }}>
    <Box position="relative">
      <MotionImage
        src="/assets/chart.png"
        height={
          {
            base: "auto",
            md: 220,
            lg: 285,
            xl: 370,
          } as any
        }
        width={850}
        maxW="100%"
        fit="contain"
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.4 }}
      />
      <MotionImage
        src="/assets/withings-scale-white.png"
        height={{ base: 120, md: 180 } as any}
        width={{ base: 120, md: 180 } as any}
        maxW="25%"
        fit="contain"
        objectPosition="right bottom"
        position="absolute"
        right={5}
        bottom={"-10%"}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.83 }}
      />
    </Box>
  </Center>
);

const WorksWith = () => {
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
      py={12}
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
          <FontAwesomeIcon icon="check" color="green" /> Compatible Smart Scales
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

export default Home;
