"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { apiClient } from "@/src/config/api_client";

function CallbackHandler() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const code = params.get("code");
    if (!code) { router.replace("/dashboard/connect"); return; }
    apiClient
      .get(`/hubspot/callback?code=${encodeURIComponent(code)}`)
      .then(() => router.replace("/dashboard/connect?connected=hubspot"))
      .catch(() => router.replace("/dashboard/connect?error=hubspot"));
  }, [params, router]);

  return (
    <Center minH="100vh" bg="gray.50">
      <VStack spacing="4">
        <Spinner size="xl" color="brand.500" thickness="3px" />
        <Text color="gray.500" fontWeight="600" fontSize="sm">Connecting HubSpot...</Text>
      </VStack>
    </Center>
  );
}

export default function HubspotCallbackPage() {
  return (
    <Suspense fallback={<Center minH="100vh" bg="gray.50"><Spinner size="xl" /></Center>}>
      <CallbackHandler />
    </Suspense>
  );
}
