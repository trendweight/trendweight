import Icon from "@chakra-ui/icon";
import { Box, Flex, Grid, Heading, Text, UnorderedList } from "@chakra-ui/layout";
import { ListItem } from "@chakra-ui/react";
import { HeartIcon, LightBulbIcon, RssIcon, ShoppingCartIcon } from "@heroicons/react/outline";
import Image from "next/image";
import React from "react";
import Link from "~/components/shared/Link";
import LinkButton from "~/components/shared/LinkButton";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const About: Page = () => {
  const { isInitializing, user } = useAuth();

  const getStarted =
    isInitializing || !user
      ? { label: "Create an Account", href: "/signup" }
      : { label: "Go to Dashboard", href: "/dashboard" };

  return (
    <Box>
      <Box display={{ base: "none", md: "block" }} float="right" pb={4} pl={4} bg="white">
        <Link href="demo">
          <Image src="/assets/screenshot-large.png" height={357} width={375} layout="intrinsic" />
        </Link>
      </Box>
      <Heading fontSize="xl" pb={4}>
        What is TrendWeight, Exactly?
      </Heading>
      <Text pb={4}>
        TrendWeight is a free weight tracking web app that filters out the noise and focuses on longer term trends in
        weight change.
      </Text>
      <Text pb={4}>
        When you really want to track your weight loss, you probably know you should disregard day to day changes in
        weight and instead focus on the trend over time. There are multiple ways to do this, but TrendWeight uses the
        methodology described by John Walker in his online book, <i>The Hacker's Diet</i>.
      </Text>
      <Box
        display="inline-block"
        pb={{ base: 6, md: 4 }}
        pr={{ base: 0, md: 8 }}
        pt={{ base: 0, md: 2 }}
        float={{ base: "unset", md: "left" }}
        className="inline-block pb-2 space-y-2 md:float-left md:pb-4 md:pr-8 md:pt-2"
      >
        <Box fontSize="lg" pb={2}>
          <b>See it in action...</b>
        </Box>
        <LinkButton href="/demo" size="lg" colorScheme="green">
          View Demo
        </LinkButton>
      </Box>
      <Text pb={4}>
        The idea is pretty simple. You weigh yourself each day and TrendWeight will plot a exponentially weighted moving
        average for your weight alongside your daily scale weight. This gives you a better idea of your weight trend by
        masking most of the day to day noise that variances in water weight introduce.
      </Text>
      <Text pb={4}>
        Your dashboard will also calculate some statistics that will help you understand how close you are to your
        weight goal and if you are hitting your weekly desired rate of weight change.
      </Text>
      <Text>
        Once you reach your goal, keep weighing yourself every day. TrendWeight will show a goal range that is a bit
        above and below your goal weight so that you can more easily see if your weight starts to creep up too high and
        you need to go back to the techniques that helped you lose weight in the first place.
      </Text>
      <Box mt={8}>
        <Grid
          templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", xl: "repeat(4, 1fr)" }}
          columnGap={10}
          rowGap={4}
        >
          <Box bg="brand.50" border="1px" borderColor="brand.100" mt={6} pb={8} px={6} rounded="lg" display="flow-root">
            <Box mt={-6}>
              <Box>
                <Box
                  display="inline-flex"
                  bg="brand.400"
                  color="white"
                  alignItems="center"
                  justifyContent="center"
                  p={3}
                  rounded="md"
                  shadow="lg"
                >
                  <Icon h={6} w={6} as={LightBulbIcon} />
                </Box>
              </Box>
              <Heading as="h3" mt={6} color="gray.900" fontSize="lg" fontWeight="medium" letterSpacing="tight">
                Questions?
              </Heading>
              <Text mt={5} color="gray.500" fontSize="md">
                Take a look at these <Link href="/faq">FAQs</Link> or email{" "}
                <Link href="mailto:erv@ewal.net">erv@ewal.net</Link>.
              </Text>
            </Box>
          </Box>
          <Box bg="brand.50" border="1px" borderColor="brand.100" mt={6} pb={8} px={6} rounded="lg" display="flow-root">
            <Box mt={-6}>
              <Box>
                <Box
                  display="inline-flex"
                  bg="brand.400"
                  color="white"
                  alignItems="center"
                  justifyContent="center"
                  p={3}
                  rounded="md"
                  shadow="lg"
                >
                  <Icon h={6} w={6} as={ShoppingCartIcon} />
                </Box>
              </Box>
              <Heading as="h3" mt={6} color="gray.900" fontSize="lg" fontWeight="medium" letterSpacing="tight">
                Get a Scale
              </Heading>
              <Text mt={5} color="gray.500" fontSize="md">
                <UnorderedList pl={4}>
                  <ListItem>
                    <Link href="https://amzn.to/2Rh8yH1">Withings Scales</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="https://amzn.to/3uEWUnS">Fitbit Scales</Link>
                  </ListItem>
                </UnorderedList>
              </Text>
            </Box>
          </Box>
          <Box bg="brand.50" border="1px" borderColor="brand.100" mt={6} pb={8} px={6} rounded="lg" display="flow-root">
            <Box mt={-6}>
              <Box>
                <Box
                  display="inline-flex"
                  bg="brand.400"
                  color="white"
                  alignItems="center"
                  justifyContent="center"
                  p={3}
                  rounded="md"
                  shadow="lg"
                >
                  <Icon h={6} w={6} as={RssIcon} />
                </Box>
              </Box>
              <Heading as="h3" mt={6} color="gray.900" fontSize="lg" fontWeight="medium" letterSpacing="tight">
                Stay Updated
              </Heading>
              <Text mt={5} color="gray.500" fontSize="md">
                <UnorderedList pl={4}>
                  <ListItem>
                    <Link href="https://twitter.com/trendweight">Twitter</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="https://github.com/trendweight/trendweight/releases">Release Notes</Link>
                  </ListItem>
                  <ListItem>
                    <Link href="https://blog.trendweight.com">Blog</Link>
                  </ListItem>
                </UnorderedList>
              </Text>
            </Box>
          </Box>
          <Box bg="brand.50" border="1px" borderColor="brand.100" mt={6} pb={8} px={6} rounded="lg" display="flow-root">
            <Box mt={-6}>
              <Box>
                <Box
                  display="inline-flex"
                  bg="brand.400"
                  color="white"
                  alignItems="center"
                  justifyContent="center"
                  p={3}
                  rounded="md"
                  shadow="lg"
                >
                  <Icon h={6} w={6} as={HeartIcon} />
                </Box>
              </Box>
              <Heading as="h3" mt={6} color="gray.900" fontSize="lg" fontWeight="medium" letterSpacing="tight">
                Support TrendWeight
              </Heading>
              <Text mt={5} color="gray.500" fontSize="md">
                TrendWeight is free, forever. But if you want info about how you can help fund it,{" "}
                <Link href="/tipjar">go here</Link>.
              </Text>
            </Box>
          </Box>
        </Grid>
      </Box>
      <Box bg="brand.50" border="1px" borderColor="brand.100" mt={10} rounded="lg">
        <Box px={{ base: 6, md: 12 }} py={{ base: 8, md: 10, lg: 12 }}>
          <Heading color="brand.600" fontSize={{ base: "xl", sm: "2xl" }} fontWeight="extrabold" letterSpacing="tight">
            Ready to check it out?
          </Heading>
          <Flex mt={2}>
            <LinkButton href={getStarted.href} colorScheme="brand" size="lg">
              {getStarted.label}
            </LinkButton>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

About.title = "About";

export default About;
