import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import React from "react";
import Footer from "~/components/Footer";
import { ResponsiveContainer } from "~/components/ResponsiveContainer";
import { useAuth } from "~/lib/auth";

const MotionImage = motion.custom(Image);

const HomeHeader = () => {
  const isNarrow = useBreakpointValue({ base: true, md: false });
  return (
    <Box as="nav" bg="brand.500" color="white">
      <ResponsiveContainer
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        flexWrap="wrap"
        px={{ base: 4, md: 0 }}
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
            <MotionImage
              src="/assets/logo-line.svg"
              height={{ base: "32px", md: "48px" } as any}
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

const Home = () => {
  const auth = useAuth();
  return (
    <>
      <Flex direction="column" minH="100vh">
        <HomeHeader />
        <Box flexGrow={1} flexShrink={1} position="relative">
          <ResponsiveContainer px={{ base: 4, md: 0 }}>
            <Grid
              templateColumns="2fr 3fr"
              templateAreas={{
                base:
                  '"blurb blurb" "buttons buttons" "chart chart" "works works" "evolution evolution"',
                md:
                  '"buttons buttons" "blurb chart" "works works" "evolution evolution"',
              }}
            >
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={4}
                align="center"
                justify="center"
                width="100%"
                gridArea="buttons"
                py={10}
              >
                <Button
                  colorScheme="green"
                  fontSize={24}
                  fontWeight="normal"
                  width={450}
                  p={7}
                >
                  Learn More
                </Button>
                <Button
                  colorScheme="brand"
                  fontSize={24}
                  fontWeight="normal"
                  width={450}
                  p={7}
                >
                  Go To Dashboard
                </Button>
              </Stack>
              <Center
                gridArea="blurb"
                pr={{ md: 6 }}
                pb={{ md: 6 }}
                pt={{ base: 6, md: 0 }}
              >
                <Box>
                  <Heading fontSize="1.6rem" pb={4}>
                    Am I losing weight?
                  </Heading>
                  <Text pb={4}>
                    TrendWeight can help answer that question by analyzing your
                    day to day weight changes
                  </Text>
                  <Text pb={4}>
                    <Text as="b">Step 1</Text>: Weigh yourself every day.
                    <br />
                    <Text as="b">Step 2</Text>: There is no Step 2!
                  </Text>
                  <Text>
                    TrendWeight is an automated weight tracking tool that helps
                    you focus on your weight trend over time instead of day to
                    day changes.
                  </Text>
                </Box>
              </Center>
              <Center
                gridArea="chart"
                position="relative"
                pb={{ base: 5, md: 10 }}
              >
                <MotionImage
                  src="/assets/chart.png"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.2, delay: 0.1 }}
                />
                <MotionImage
                  src="/assets/withings-scale-white.png"
                  height={{ base: 100, md: 180 } as any}
                  width={{ base: 100, md: 180 } as any}
                  position="absolute"
                  right={5}
                  bottom={0}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                />
              </Center>
              <Stack
                direction={{ base: "column", md: "row" }}
                spacing={4}
                align="center"
                justify="center"
                width="100%"
                gridArea="works"
                py={6}
              >
                <Center
                  boxSize={320}
                  borderRadius={20}
                  bg="gray.50"
                  border="1px solid #ccc"
                >
                  <Flex
                    direction="column"
                    align="center"
                    p={1}
                    // width={{ base: "100%", md: "50%" }}
                  >
                    <Image
                      src="/assets/withings-app.png"
                      height="200px"
                      pb={4}
                    />
                    <Flex direction="column">
                      <Text fontSize="18px" fontWeight="bold">
                        Works with
                      </Text>
                      <Image src="/assets/withings-logo.png" height="26px" />
                    </Flex>
                  </Flex>
                </Center>{" "}
                <Center
                  boxSize={320}
                  borderRadius={20}
                  bg="gray.50"
                  border="1px solid #ccc"
                >
                  <Flex
                    direction="column"
                    align="center"
                    p={1}
                    // width={{ base: "100%", md: "50%" }}
                  >
                    <Image src="/assets/fitbit-app.png" height="200px" pb={4} />
                    <Flex direction="column">
                      <Text fontSize="18px" fontWeight="bold">
                        Works with
                      </Text>
                      <Image src="/assets/fitbit-logo.png" height="32px" />
                    </Flex>
                  </Flex>
                </Center>
              </Stack>
            </Grid>
          </ResponsiveContainer>
        </Box>
        <Footer />
      </Flex>
    </>
  );
};

export default Home;
