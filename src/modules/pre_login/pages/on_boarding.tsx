"use client";

import React from "react";
import NextLink from "next/link";
import { Box, VStack, HStack, Heading, Text, Link as ChakraLink } from "@chakra-ui/react";
import { Zap, ShieldCheck, Bell } from "lucide-react";

const FEATURES = [
  { icon: Zap,         title: "Freshdesk Tickets",  desc: "View and manage all support tickets in one place." },
  { icon: ShieldCheck, title: "HubSpot CRM",         desc: "Instantly look up customer info from ticket requesters." },
  { icon: Bell,        title: "Webhook Events",      desc: "Monitor real-time Freshdesk events and logs." },
];

export default function OnboardingPage() {
  return (
    <Box minH="100vh" bg="gray.50" display="flex" flexDir="column" alignItems="center" justifyContent="center" p="6">
      <VStack maxW="md" w="full" spacing="8" textAlign="center">
        <Box bg="#04374E" p="5" borderRadius="3xl" boxShadow="0 20px 60px rgba(4,55,78,0.3)">
          <Zap size={44} color="white" />
        </Box>
        <VStack spacing="2">
          <Heading fontSize="4xl" fontWeight="900" color="gray.900" letterSpacing="-0.04em">
            Spritle Portal
          </Heading>
          <Text color="gray.500" fontSize="lg">Freshdesk &amp; HubSpot — unified.</Text>
        </VStack>
        <VStack w="full" spacing="3" align="stretch">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <HStack key={f.title} bg="white" p="4" borderRadius="xl"
                border="1px solid" borderColor="gray.100" boxShadow="sm" spacing="4" textAlign="left">
                <Box bg="gray.100" p="2.5" borderRadius="lg" flexShrink={0}>
                  <Icon size={18} color="#04374E" />
                </Box>
                <Box>
                  <Text fontWeight="700" fontSize="sm" color="gray.900">{f.title}</Text>
                  <Text fontSize="xs" color="gray.400">{f.desc}</Text>
                </Box>
              </HStack>
            );
          })}
        </VStack>
        <VStack w="full" spacing="3">
          <ChakraLink as={NextLink} href="/sign_up" w="full" _hover={{ textDecor: "none" }}>
            <Box w="full" bg="#04374E" color="white" fontWeight="700" fontSize="md"
              py="4" borderRadius="2xl" textAlign="center"
              _hover={{ bg: "#032C3E" }} transition="all 0.2s">
              Create Account
            </Box>
          </ChakraLink>
          <ChakraLink as={NextLink} href="/login" w="full" _hover={{ textDecor: "none" }}>
            <Box w="full" bg="white" color="gray.900" fontWeight="700" fontSize="md"
              py="4" borderRadius="2xl" textAlign="center"
              border="1px solid" borderColor="gray.200"
              _hover={{ bg: "gray.50" }} transition="all 0.2s">
              Sign In
            </Box>
          </ChakraLink>
        </VStack>
        <Text fontSize="xs" color="gray.400">By continuing, you agree to our Terms of Service.</Text>
      </VStack>
    </Box>
  );
}
