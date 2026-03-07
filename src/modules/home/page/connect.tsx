"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Heading, Text, VStack, HStack, Badge,
  Spinner, Center, useToast,
} from "@chakra-ui/react";
import { CheckCircle, XCircle, ExternalLink, Zap } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { freshdeskApi, hubspotApi } from "@/src/config/api_client";
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { FormInput } from "@/src/shared/components/input_field";

// ── Zod Schema (same pattern as signup_schema.ts) ────────────────────────────
const freshdeskSchema = z.object({
  domain: z.string()
    .min(1, "Domain is required")
    .refine((v) => !v.includes("freshdesk.com"), {
      message: "Enter only the subdomain e.g. 'acme' not 'acme.freshdesk.com'",
    }),
  apiKey: z.string().min(1, "API Key is required"),
});

type FreshdeskValues = z.infer<typeof freshdeskSchema>;

interface Status { freshdesk: boolean; hubspot: boolean }

export default function ConnectPage() {
  const [status, setStatus]   = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // ── React Hook Form (same pattern as signup.tsx) ──────────────────────────
  const form = useForm<FreshdeskValues>({
    resolver: zodResolver(freshdeskSchema),
    defaultValues: { domain: "", apiKey: "" },
  });

  const fetchStatus = async () => {
    try {
      const res = await freshdeskApi.status();
      setStatus(res.data);
    } catch {
      setStatus({ freshdesk: false, hubspot: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStatus(); }, []);

  // ── Connect Freshdesk ─────────────────────────────────────────────────────
  const connectFreshdesk = async (data: FreshdeskValues) => {
    try {
      await freshdeskApi.connect({ apiKey: data.apiKey, domain: data.domain });
      toast({ title: "Freshdesk connected!", status: "success", duration: 3000, isClosable: true });
      form.reset();
      fetchStatus();
    } catch (e: any) {
      toast({
        title: "Connection failed",
        description: e?.response?.data?.message ?? "Check your credentials",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  // ── Connect HubSpot ───────────────────────────────────────────────────────
  const connectHubspot = async () => {
    try {
      const res = await hubspotApi.getAuthUrl();
      window.location.href = res.data.url;
    } catch {
      toast({ title: "Failed to get HubSpot auth URL", status: "error", duration: 3000 });
    }
  };

  if (loading) return (
    <Center minH="60vh">
      <Spinner size="xl" color="brand.500" thickness="3px" />
    </Center>
  );

  return (
    <Box maxW="3xl" mx="auto" py="8" px="4">
      <Box mb="10">
        <Heading fontSize="2xl" fontWeight="900" color="gray.900" letterSpacing="-0.03em">
          Connect Accounts
        </Heading>
        <Text fontSize="xs" color="gray.400" fontWeight="600"
          textTransform="uppercase" letterSpacing="0.12em" mt="1">
          Link your Freshdesk and HubSpot accounts
        </Text>
      </Box>

      <VStack spacing="6" align="stretch">

        {/* ── Freshdesk Card ──────────────────────────────────────────────── */}
        <Box bg="white" border="1px solid"
          borderColor={status?.freshdesk ? "green.200" : "gray.100"}
          borderRadius="2xl" p="7" boxShadow="sm">

          <HStack justify="space-between" mb="5">
            <HStack spacing="3">
              <Box w="10" h="10" bg="green.50" borderRadius="xl"
                display="flex" alignItems="center" justifyContent="center">
                <Zap size={20} color="#16a34a" />
              </Box>
              <Box>
                <Text fontWeight="800" color="gray.900">Freshdesk</Text>
                <Text fontSize="xs" color="gray.400">API Key Authentication</Text>
              </Box>
            </HStack>
            <Badge colorScheme={status?.freshdesk ? "green" : "red"}
              borderRadius="full" px="3">
              <HStack spacing="1">
                {status?.freshdesk ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <Text>{status?.freshdesk ? "Connected" : "Not Connected"}</Text>
              </HStack>
            </Badge>
          </HStack>

          {!status?.freshdesk ? (
            // ✅ Same pattern as SignupForm — useForm + Controller + FormInput
            <form onSubmit={form.handleSubmit(connectFreshdesk)}>
              <VStack spacing="4" align="stretch">
                <Controller
                  control={form.control}
                  name="domain"
                  render={({ field, fieldState }) => (
                    <FormInput
                      field={field}
                      label="Freshdesk Domain"
                      placeholder="yourcompany"
                      type="text"
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <Controller
                  control={form.control}
                  name="apiKey"
                  render={({ field, fieldState }) => (
                    <FormInput
                      field={field}
                      label="API Key"
                      placeholder="Your Freshdesk API key"
                      type="password"
                      error={fieldState.error?.message}
                    />
                  )}
                />
                <PrimaryButton
                  type="submit"
                  isLoading={form.formState.isSubmitting}
                  mt="2"
                >
                  Connect Freshdesk
                </PrimaryButton>
              </VStack>
            </form>
          ) : (
            <Text fontSize="sm" color="green.600" fontWeight="600">
              ✓ Your Freshdesk account is connected. Tickets are ready to view.
            </Text>
          )}
        </Box>

        {/* ── HubSpot Card ────────────────────────────────────────────────── */}
        <Box bg="white" border="1px solid"
          borderColor={status?.hubspot ? "orange.200" : "gray.100"}
          borderRadius="2xl" p="7" boxShadow="sm">

          <HStack justify="space-between" mb="5">
            <HStack spacing="3">
              <Box w="10" h="10" bg="orange.50" borderRadius="xl"
                display="flex" alignItems="center" justifyContent="center">
                <ExternalLink size={20} color="#ea580c" />
              </Box>
              <Box>
                <Text fontWeight="800" color="gray.900">HubSpot</Text>
                <Text fontSize="xs" color="gray.400">OAuth 2.0 Authentication</Text>
              </Box>
            </HStack>
            <Badge colorScheme={status?.hubspot ? "green" : "orange"}
              borderRadius="full" px="3">
              <HStack spacing="1">
                {status?.hubspot ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <Text>{status?.hubspot ? "Connected" : "Not Connected"}</Text>
              </HStack>
            </Badge>
          </HStack>

          {!status?.hubspot ? (
            <VStack spacing="4" align="stretch">
              <Text fontSize="sm" color="gray.500">
                Connect HubSpot to look up CRM contact info for ticket requesters.
              </Text>
              <PrimaryButton
                onClick={connectHubspot}
                bg="orange.500"
                _hover={{ bg: "orange.600" }}
              >
                <HStack spacing="2">
                  <ExternalLink size={16} />
                  <Text>Connect with HubSpot</Text>
                </HStack>
              </PrimaryButton>
            </VStack>
          ) : (
            <Text fontSize="sm" color="green.600" fontWeight="600">
              ✓ HubSpot connected. Contact lookup is active on ticket detail pages.
            </Text>
          )}
        </Box>

      </VStack>
    </Box>
  );
}