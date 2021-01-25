import {
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  VisuallyHidden,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import RouteLink from "~/components/shared/RouteLink";
import { Page } from "~/lib/core/page";
import { useAuth } from "~/lib/hooks/auth";

const Login: Page = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loginFailed, setLoginFailed] = useState<string | undefined>(undefined);
  const { handleSubmit, errors, register, formState } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    try {
      console.log(values);
      await auth.signInWithPassword(values.email, values.password);
      setLoginFailed(undefined);
    } catch (error) {
      setLoginFailed(error.code);
    }
  });

  if (auth.isInitializing || auth.user) {
    if (auth.user) {
      router.push("/dashboard");
    }
    return null;
  } else {
    return (
      <form onSubmit={onSubmit}>
        <Center>
          <Stack
            borderColor={["inherit", "gray.100"]}
            bg={["inherit", "#f7f9fc"]}
            borderWidth={[0, 1]}
            borderRadius={{ base: 0, md: 8 }}
            maxWidth="400px"
            px={[0, 8]}
            py={[0, 12]}
            my={[4, 12]}
            shadow={{ base: "none", md: "md" }}
            spacing={[6, 6]}
            w="100%"
          >
            <Heading size="md" color="brand.500">
              Sign In
            </Heading>
            <FormControl id="email" isInvalid={errors.email}>
              <VisuallyHidden>
                <FormLabel>Email</FormLabel>
              </VisuallyHidden>
              <Input
                type="email"
                name="email"
                placeholder="Email"
                ref={register({
                  required: "Please enter your email",
                })}
              />
              <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
            </FormControl>
            <FormControl id="password" isInvalid={errors.password}>
              <VisuallyHidden>
                <FormLabel>Password</FormLabel>
              </VisuallyHidden>
              <Input
                type="password"
                name="password"
                placeholder="Password"
                ref={register({ required: "Please enter your password" })}
              />
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
            <Stack direction="row" align="center">
              <Button isLoading={formState.isSubmitting} type="submit">
                Sign In
              </Button>
              <Box>
                or <RouteLink href="/register">create an account</RouteLink>
              </Box>
            </Stack>
            <Stack>
              <RouteLink href="">forgot your password?</RouteLink>
              <Box hidden={!loginFailed} color="red.500">
                Invalid email or password
              </Box>
            </Stack>
          </Stack>
        </Center>
      </form>
    );
  }
};

Login.title = "Sign In";
Login.requireLogin = false;

export default Login;
