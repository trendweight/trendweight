import { Box, Collapse, Flex, useOutsideClick } from "@chakra-ui/react";
import { useRef } from "react";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

const MobileNav: React.FC<Props> = (props) => {
  const { isOpen, onClose, children } = props;
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick({
    ref,
    handler: onClose,
  });
  return (
    <Box w="100%" onClick={onClose} display={{ md: "none" }} ref={ref}>
      <Collapse in={isOpen}>
        {/* <AnimatePresence>
        {isOpen && (
          <motion.div
            transition={{ duration: 0.1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          > */}
        <Flex
          direction="column"
          bg="brand.400"
          w="100%"
          overflow="auto"
          // pos="absolute"
          // top={0}
          // left={0}
          // zIndex={20}
          px={4}
          py={4}
        >
          {children}
        </Flex>
        {/* </motion.div>
        )}
      </AnimatePresence> */}
      </Collapse>
    </Box>
  );
};

export default MobileNav;
