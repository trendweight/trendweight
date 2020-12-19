import { Button, Code, Text } from "@chakra-ui/react";
import { useAuth } from "~/lib/auth";

export default function Home() {
  const auth = useAuth();
  return (
    <>
      <Text>
        Current user: <Code>{auth?.user ? auth.user.email : "None"}</Code>
      </Text>
      {auth.user ? (
        <Button onClick={(e) => auth.signOut()}>Sign Out</Button>
      ) : (
        <Button onClick={(e) => auth.signinWithGithub()}>Sign In</Button>
      )}
    </>
  );
}
