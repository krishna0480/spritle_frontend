"use client";

import React from "react";
import { Box, Heading, Text, SimpleGrid } from "@chakra-ui/react";
import { StatCard } from "../component/card";
import { DASHBOARD_CARDS } from "../constants";

export default function DashboardPage() {
  return (
    <Box maxW="6xl" mx="auto" py="8" px="4">
      <Box mb="10">
        <Heading fontSize="3xl" fontWeight="900" color="gray.900" letterSpacing="-0.03em">
          Dashboard Overview
        </Heading>
        <Text fontSize="xs" fontWeight="700" textTransform="uppercase"
          letterSpacing="0.15em" color="gray.400" mt="1">
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
