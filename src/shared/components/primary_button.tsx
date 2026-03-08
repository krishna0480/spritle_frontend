"use client";

import React from "react";
import { Button, type ButtonProps } from "@chakra-ui/react";

export interface PrimaryButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({ isLoading, children, isDisabled, ...props }, ref) => (
    <Button
      ref={ref}
      isLoading={isLoading}
      isDisabled={isLoading || isDisabled}
      loadingText="Processing..."
      w="full"
      h="12"
      px="6"
      bg="linear-gradient(135deg, #0d4f6e, #0d9f83)"
      color="white"
      fontWeight="700"
      fontSize="md"
      borderRadius="xl"
      _hover={{
        bg: "linear-gradient(135deg, #0a3d56, #097a64)",
        transform: "translateY(-1px)",
        boxShadow: "0 6px 20px rgba(13,79,110,0.4)"
      }}
      _active={{ transform: "translateY(0)", boxShadow: "none" }}
      _disabled={{ opacity: 0.5, cursor: "not-allowed", transform: "none" }}
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Button>
  )
);
PrimaryButton.displayName = "PrimaryButton";
