import { Box, Button, ButtonProps, useId, useRadio, UseRadioProps } from "@chakra-ui/react";
import * as React from "react";

export interface ToggleButtonProps extends ButtonProps {
  value: string;
  radioProps?: UseRadioProps;
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const { radioProps, ...rest } = props;
  const {
    getInputProps,
    getCheckboxProps,
    getLabelProps,
    state: { isChecked },
  } = useRadio(radioProps);
  const id = useId(undefined, "toggle-button");

  const inputProps = getInputProps();
  const checkboxProps = getCheckboxProps();
  const labelProps = getLabelProps();
  return (
    <Box as="label" cursor="pointer" {...labelProps}>
      <input {...inputProps} aria-labelledby={id} />
      <Button
        as="div"
        id={id}
        bg="white"
        color="gray.800"
        px={{ base: 2, md: 3 }}
        fontWeight={450}
        borderWidth={1}
        borderColor="gray.300"
        _checked={{
          bg: "brand.500",
          borderColor: "brand.500",
          color: "white",
        }}
        _hover={
          isChecked
            ? {
                bg: { base: "inherit", md: "brand.800" },
                color: "white",
              }
            : { bg: { base: "inherit", md: "gray.200" }, color: "gray.800" }
        }
        _active={{
          bg: "inherit",
        }}
        _focus={{
          bg: "inherit",
        }}
        {...checkboxProps}
        {...rest}
      />
    </Box>
  );
};
