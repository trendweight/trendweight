import {
  Box,
  Button,
  Center,
  FormControl,
  FormControlProps,
  FormErrorMessage,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import Layout from "~/components/layout/Layout";
import Page from "~/components/layout/Page";
import RouteLink from "~/components/shared/RouteLink";
import { useAuth } from "~/lib/auth";

const FloatingFormControl: FC<FormControlProps> = (props) => {
  return (
    <FormControl
      {...props}
      css={css`
        position: relative;
        padding-top: 0.3rem;
        & > label {
          position: absolute;
          top: 0.8rem;
          opacity: 0;
          transition: all 0.3s ease;
          transform-origin: top left;
        }
        & > input:not(:placeholder-shown) {
          // padding: 28px 0px 12px 0px;
        }
        & > input:not(:placeholder-shown) + label {
          transform-origin: top left;
          transform: translateY(-1.2rem) scale(0.75);
          opacity: 0.7;
        }
      `}
    />
  );
};

const Login = () => {
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
    return <Layout />;
  } else {
    return (
      <Page title="Sign In">
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
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  ref={register({ required: "Email is required" })}
                />
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={errors.password}>
                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  ref={register({ required: "Password is required" })}
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
      </Page>
    );
  }
};

export default Login;
