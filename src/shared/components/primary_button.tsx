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
      bg="#0d1b2a"
      color="white"
      fontWeight="700"
      fontSize="md"
      borderRadius="md"
      _hover={{ bg: "#1b263b", transform: "translateY(-1px)", boxShadow: "0 4px 12px rgba(13,27,42,0.3)" }}
      _active={{ bg: "#000814", transform: "translateY(0)" }}
      _disabled={{ opacity: 0.5, cursor: "not-allowed", transform: "none" }}
      transition="all 0.2s"
      {...props}
    >
      {children}
    </Button>
  )
);
PrimaryButton.displayName = "PrimaryButton";
