import { Box, Flex, Image, Stack } from "@chakra-ui/react";
import LinkButton from "../modules/shared/components/LinkButton";
import { Page } from "../modules/shared/page";

const PageNotFound: Page = () => (
  <Flex direction="column" minH="67vh" align={["flex-start", "center"]} justify={["flex-start", "center"]}>
    <Stack direction={{ base: "column", md: "row" }} alignItems={{ base: "initial", md: "center" }} p={4} spacing={8}>
      <Box pr={[0, 8]} py={4} borderRight={{ base: "none", md: "1px solid #e8e8e8" }} maxW={600} width="100%">
        <Box fontFamily="'Zilla Slab', serif" fontWeight="700" fontSize={["36px", "48px"]} pr={2} lineHeight={1.2} color="brand.500">
          TrendWeight
        </Box>
        <Box mt={4}>
          <b>404.</b> That's an error.
        </Box>
        <Box mt={4}>The requested URL was not found on this site.</Box>
        <Box mt={4}>moved.Or maybe the link you clicked on is just wrong.Or maybe it was abducted?We'll probably never know.</Box>
        <Box mt={4}>
          <LinkButton href="/">Go to Homepage</LinkButton>
        </Box>
      </Box>
      <Image src="/assets/taken.svg" alt="alien abduction icon" height={{ base: "auto", md: 150, lg: 200 }} width={{ base: "100%", md: "auto" }} maxW={200} />
    </Stack>
  </Flex>
);

PageNotFound.bypassShell = true;
PageNotFound.title = "Error 404 (Not Found)";

export default PageNotFound;
