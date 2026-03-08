"use client";

import React from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { StatCard } from "../component/card";
import { DASHBOARD_CARDS } from "../constants";
import { ErrorBoundary } from "@/src/shared/components";

function DashboardContent() {
  return (
    <Box maxW="6xl" mx="auto">
      <Box mb="10">
        <Heading fontSize="3xl" fontWeight="900" color="white" letterSpacing="-0.03em"
          textShadow="0 2px 10px rgba(0,0,0,0.2)">
          Dashboard Overview
        </Heading>
        <Text fontSize="xs" fontWeight="700" textTransform="uppercase"
          letterSpacing="0.15em" color="whiteAlpha.700" mt="1">
          Integration Metrics
        </Text>
      </Box>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing="8">
        {DASHBOARD_CARDS.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

export default function DashboardPage() {
  return (
    <ErrorBoundary fallbackTitle="Dashboard failed to load">
      <DashboardContent />
    </ErrorBoundary>
  );
}
