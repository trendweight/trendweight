import { Icon, IconProps } from "@chakra-ui/react";
import { FC } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Logo: FC<IconProps> = (props) => {
  return (
    <Icon viewBox="0 0 458 190" xmlns="http://www.w3.org/2000/svg" {...props}>
      <title>{"background"}</title>
      <path fill="none" d="M-1-1h438.19v182.952H-1z" />
      <g>
        <title>{"Layer 1"}</title>
        <path
          d="M16.181 85.794L57.86 54.51l37.511 31.284 25.007-18.77 20.839 12.513L176.644 56.6l52.1 37.541L247.5 16.969l29.175 77.168 33.343-14.6 35.427 58.4 37.511 6.257 25.008-18.77 33.343 47.968"
          fill="none"
          stroke="#fff"
          strokeLinejoin="round"
          strokeWidth={8}
        />
      </g>
    </Icon>
  );
};

export default Logo;
