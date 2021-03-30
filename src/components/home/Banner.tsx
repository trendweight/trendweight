import React from "react";
import ResponsiveContainer from "~/components/layout/ResponsiveContainer";
import Logo from "~/components/shared/Logo";

const Banner = () => {
  const isNarrow = useBreakpointValue({ base: true, md: false });
  return (
    <Box as="header" bg="brand.500" color="white">
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
            <Logo height={{ base: "32px", md: "48px" }} width={{ base: "77.13px", md: "115.7px" }} />
          </Flex>
          <Text fontSize={{ base: "20px", md: "22px" }}>
            Automated Weight Tracking{isNarrow ? null : ", Hacker's Diet Style"}
          </Text>
        </Flex>
      </ResponsiveContainer>
    </Box>
  );
};

export default Banner;
