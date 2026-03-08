"use client";

import { Box, HStack, VStack, Text } from "@chakra-ui/react";
import { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { PrimaryButton } from "@/src/shared/components/primary_button";

export type CardVariant = "blue" | "green" | "border-blue" | "border-green";

export interface DashboardCard {
  title: string;
  icon: LucideIcon;
  variant: CardVariant;
  description: string | null;
  buttonText: string | null;
  buttonVariant: "blue" | "green" | null;
  route: string | null;
  list: string[] | null;
}

export function StatCard({ title, description, list, buttonText, buttonVariant, variant, icon: CardIcon, route }: DashboardCard) {
  const router = useRouter();
  const isBlue = variant?.includes("blue") || buttonVariant === "blue";

  return (
    <Box bg="white" p="8" borderRadius="3xl"
      boxShadow="0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(255,255,255,0.8)"
      _hover={{ boxShadow: "0 16px 50px rgba(0,0,0,0.2)", transform: "translateY(-3px)" }}
      transition="all 0.25s" display="flex" flexDir="column" alignItems="center" textAlign="center" h="full">

      <VStack flex="1" w="full" spacing="4">
        <Box p="4" borderRadius="2xl"
          bg={isBlue ? "linear-gradient(135deg, #0d4f6e, #1a6b8a)" : "linear-gradient(135deg, #0a7c5c, #0d9f83)"}
          color="white"
          boxShadow={isBlue ? "0 8px 20px rgba(13,79,110,0.4)" : "0 8px 20px rgba(13,159,131,0.4)"}>
          <CardIcon size={28} />
        </Box>
        <VStack spacing="1">
          <Text fontSize="xl" fontWeight="800" color="gray.800">{title}</Text>
          {description && (
            <Text fontSize="sm" color="gray.500" maxW="200px" lineHeight="relaxed">{description}</Text>
          )}
        </VStack>
        {list && (
          <Box w="full" bg="gray.50" p="4" borderRadius="xl" border="1px solid" borderColor="gray.100" textAlign="left">
            <VStack spacing="3" align="stretch">
              {list.map((item, i) => (
                <HStack key={i} spacing="3">
                  <Box w="1.5" h="1.5" borderRadius="full"
                    bg={isBlue ? "#1a6b8a" : "#0d9f83"} flexShrink={0} mt="0.5" />
                  <Text fontSize="sm" color="gray.600">{item}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>

      {buttonText && route && (
        <Box w="full" pt="6" mt="auto">
          <PrimaryButton
            onClick={() => router.push(route)}
            bg={buttonVariant === "blue"
              ? "linear-gradient(135deg, #0d4f6e, #1a6b8a)"
              : "linear-gradient(135deg, #0a7c5c, #0d9f83)"}
            _hover={{
              bg: buttonVariant === "blue"
                ? "linear-gradient(135deg, #0a3d56, #14527a)"
                : "linear-gradient(135deg, #085e46, #097a64)",
              transform: "translateY(-1px)",
            }}
            fontSize="sm" borderRadius="xl"
          >
            {buttonText}
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
}
