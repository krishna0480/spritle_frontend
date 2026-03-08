"use client";

import React, { Component, ReactNode } from "react";
import { Box, Text, VStack, HStack, Code } from "@chakra-ui/react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { PrimaryButton } from "./primary_button";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <Box
        minH="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="6"
      >
        <Box
          bg="white"
          borderRadius="3xl"
          boxShadow="0 20px 60px rgba(0,0,0,0.15)"
          p="10"
          maxW="lg"
          w="full"
          textAlign="center"
        >
          <VStack spacing="6">
            {/* Icon */}
            <Box
              w="16"
              h="16"
              borderRadius="2xl"
              bg="linear-gradient(135deg, #fee2e2, #fecaca)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              boxShadow="0 8px 20px rgba(239,68,68,0.2)"
            >
              <AlertTriangle size={32} color="#dc2626" />
            </Box>

            {/* Title */}
            <VStack spacing="1">
              <Text
                fontSize="xl"
                fontWeight="900"
                color="gray.900"
                letterSpacing="-0.02em"
              >
                {this.props.fallbackTitle ?? "Something went wrong"}
              </Text>
              <Text fontSize="sm" color="gray.500" maxW="sm" lineHeight="relaxed">
                An unexpected error occurred while rendering this page. You can
                try refreshing, or contact support if the issue persists.
              </Text>
            </VStack>

            {/* Error message */}
            {this.state.error?.message && (
              <Box
                w="full"
                bg="gray.50"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="xl"
                p="4"
                textAlign="left"
              >
                <Text
                  fontSize="xs"
                  fontWeight="700"
                  color="gray.400"
                  textTransform="uppercase"
                  letterSpacing="0.1em"
                  mb="1"
                >
                  Error details
                </Text>
                <Code
                  fontSize="xs"
                  color="red.600"
                  bg="transparent"
                  display="block"
                  whiteSpace="pre-wrap"
                  wordBreak="break-word"
                >
                  {this.state.error.message}
                </Code>
              </Box>
            )}

            {/* Actions */}
            <HStack spacing="3" w="full">
              <PrimaryButton onClick={this.handleReset}>
                <HStack spacing="2">
                  <RefreshCw size={15} />
                  <Text>Try Again</Text>
                </HStack>
              </PrimaryButton>
              <Box
                as="button"
                w="full"
                h="12"
                px="6"
                borderRadius="xl"
                border="1px solid"
                borderColor="gray.200"
                bg="white"
                color="gray.700"
                fontWeight="700"
                fontSize="md"
                cursor="pointer"
                _hover={{ bg: "gray.50" }}
                transition="all 0.2s"
                onClick={() => window.location.reload()}
              >
                Reload Page
              </Box>
            </HStack>
          </VStack>
        </Box>
      </Box>
    );
  }
}
