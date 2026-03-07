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

  const borderColor = variant === "border-blue" ? "blue.100" : variant === "border-green" ? "green.100" : "gray.100";
  const bgColor     = variant === "border-blue" ? "blue.50"  : variant === "border-green" ? "green.50"  : "white";

  return (
    <Box bg={bgColor} p="8" borderRadius="3xl" border="1px solid" borderColor={borderColor}
      boxShadow="sm" _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
      transition="all 0.2s" display="flex" flexDir="column" alignItems="center" textAlign="center" h="full">

      <VStack flex="1" w="full" spacing="4">
        <Box p="4" borderRadius="2xl" bg={isBlue ? "blue.50" : "green.50"} color={isBlue ? "blue.600" : "green.600"}>
          <CardIcon size={28} />
        </Box>
        <VStack spacing="1">
          <Text fontSize="xl" fontWeight="800" color="gray.800">{title}</Text>
          {description && (
            <Text fontSize="sm" color="gray.500" maxW="200px" lineHeight="relaxed">{description}</Text>
          )}
        </VStack>
        {list && (
          <Box w="full" bg="white" p="4" borderRadius="xl" border="1px solid" borderColor="gray.50" textAlign="left">
            <VStack spacing="3" align="stretch">
              {list.map((item, i) => (
                <HStack key={i} spacing="3">
                  <Box w="1.5" h="1.5" borderRadius="full" bg={isBlue ? "blue.500" : "green.500"} flexShrink={0} mt="0.5" />
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
            bg={buttonVariant === "blue" ? "#04374E" : "green.600"}
            _hover={{ bg: buttonVariant === "blue" ? "#032C3E" : "green.700" }}
            h="11" fontSize="sm" borderRadius="xl"
          >
            {buttonText}
          </PrimaryButton>
        </Box>
      )}
    </Box>
  );
}
