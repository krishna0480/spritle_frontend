"use client";

import React from "react";
import NextLink from "next/link";
import { Box, VStack, HStack, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Zap, ShieldCheck, Bell } from "lucide-react";
import { ErrorBoundary } from "@/src/shared/components";

const FEATURES = [
  { icon: Zap,         title: "Freshdesk Tickets",  desc: "View and manage all support tickets in one place." },
  { icon: ShieldCheck, title: "HubSpot CRM",         desc: "Instantly look up customer info from ticket requesters." },
  { icon: Bell,        title: "Webhook Events",      desc: "Monitor real-time Freshdesk events and logs." },
];

export default function OnboardingPage() {
  return (
    <ErrorBoundary fallbackTitle="Page failed to load">
      <OnboardingContent />
    </ErrorBoundary>
  );
}

function OnboardingContent() {
  return (
    <Box minH="100vh" display="flex" flexDir="column" alignItems="center" justifyContent="center" p="6">
      <VStack maxW="md" w="full" spacing="8" textAlign="center">
        <Box bg="white" p="5" borderRadius="3xl" boxShadow="0 20px 60px rgba(0,0,0,0.25)">
          <Zap size={44} color="#0d9f83" />
        </Box>
        <VStack spacing="2">
          <Heading fontSize="4xl" fontWeight="900" color="white" letterSpacing="-0.04em"
            textShadow="0 2px 20px rgba(0,0,0,0.3)">
            Spritle Portal
          </Heading>
          <Text color="whiteAlpha.800" fontSize="lg">Freshdesk &amp; HubSpot — Task Assessment</Text>
        </VStack>
        <VStack w="full" spacing="3" align="stretch">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <HStack key={f.title} bg="white" p="4" borderRadius="2xl"
                boxShadow="0 4px 20px rgba(0,0,0,0.15)" spacing="4" textAlign="left">
                <Box bg="linear-gradient(135deg, #0d4f6e, #0d9f83)" p="2.5" borderRadius="lg" flexShrink={0}>
                  <Icon size={18} color="white" />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize="sm" color="gray.900">{f.title}</Text>
                  <Text fontSize="xs" color="gray.500">{f.desc}</Text>
                </Box>
              </HStack>
            );
          })}
        </VStack>
        <VStack w="full" spacing="3">
          <ChakraLink as={NextLink} href="/sign_up" w="full" _hover={{ textDecor: "none" }}>
            <Box w="full" bg="white" color="gray.900" fontWeight="800" fontSize="md"
              py="4" borderRadius="2xl" textAlign="center"
              boxShadow="0 4px 20px rgba(0,0,0,0.2)"
              _hover={{ transform: "translateY(-2px)", boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}
              transition="all 0.2s">
              Create Account
            </Box>
          </ChakraLink>
          <ChakraLink as={NextLink} href="/login" w="full" _hover={{ textDecor: "none" }}>
            <Box w="full" bg="whiteAlpha.200" color="white" fontWeight="700" fontSize="md"
              py="4" borderRadius="2xl" textAlign="center"
              border="1px solid" borderColor="whiteAlpha.400"
              backdropFilter="blur(10px)"
              _hover={{ bg: "whiteAlpha.300" }} transition="all 0.2s">
              Sign In
            </Box>
          </ChakraLink>
        </VStack>
        <Text fontSize="xs" color="whiteAlpha.600">By continuing, you agree to our Terms of Service.</Text>
      </VStack>
    </Box>
  );
}
