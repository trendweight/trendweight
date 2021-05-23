import { Box, Button, ButtonProps, useId, useRadio, UseRadioProps } from "@chakra-ui/react";
import * as React from "react";

export interface ToggleButtonProps extends ButtonProps {
  value: string;
  radioProps?: UseRadioProps;
}

export const ToggleButton = (props: ToggleButtonProps) => {
  const { radioProps, ...rest } = props;
  const { getInputProps, getCheckboxProps, getLabelProps } = useRadio(radioProps);
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
        px={{ base: 2, md: 3 }}
        fontWeight={450}
        color="unset"
        borderWidth={1}
        borderColor="gray.300"
        colorScheme="gray"
        _checked={{
          colorScheme: "brand",
          bg: "brand.500",
          color: "white",
        }}
        {...checkboxProps}
        {...rest}
      />
    </Box>
  );
};
