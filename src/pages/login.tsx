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
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "~/components/shared/Link";
import { useAuth } from "~/lib/core/auth";
import { Page } from "~/lib/core/page";

const Login: Page = () => {
  const auth = useAuth();
  const router = useRouter();
  const [loginFailed, setLoginFailed] = useState<string | undefined>(undefined);
  const { handleSubmit, formState, register } = useForm();
  const { errors } = formState;

  const onSubmit = handleSubmit(async (values) => {
    try {
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
            <Heading color="brand.500" pb={0}>
              Sign In
            </Heading>
            <FormControl id="email" isInvalid={errors.email}>
              <VisuallyHidden>
                <FormLabel>Email</FormLabel>
              </VisuallyHidden>
              <Input
                type="email"
                placeholder="Email"
                {...register("email", {
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
                placeholder="Password"
                {...register("password", { required: "Please enter your password" })}
              />
              <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
            </FormControl>
            <Stack direction="row" align="center">
              <Button isLoading={formState.isSubmitting} type="submit">
                Sign In
              </Button>
              <Box>
                or <Link href="/register">create an account</Link>
              </Box>
            </Stack>
            <Stack>
              <Link href="/resetpassword">forgot your password?</Link>
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

Login.title = "Log In";
Login.requireLogin = false;

export default Login;
