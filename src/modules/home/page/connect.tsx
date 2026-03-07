"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Heading, Text, VStack, HStack, Badge,
  Input, Button, Spinner, Center,
  FormControl, FormLabel, FormHelperText, useToast,
} from "@chakra-ui/react";
import { CheckCircle, XCircle, ExternalLink, Zap } from "lucide-react";
import { freshdeskApi, hubspotApi } from "@/src/config/api_client";
import { PrimaryButton } from "@/src/shared/components/primary_button";

interface Status { freshdesk: boolean; hubspot: boolean }

export default function ConnectPage() {
  const [status, setStatus]         = useState<Status | null>(null);
  const [loading, setLoading]       = useState(true);
  const [apiKey, setApiKey]         = useState("");
  const [domain, setDomain]         = useState("");
  const [connecting, setConnecting] = useState(false);
  const toast = useToast();

  const fetchStatus = async () => {
    try {
      const res = await freshdeskApi.status();
      setStatus(res.data);
    } catch { setStatus({ freshdesk: false, hubspot: false }); }
    finally   { setLoading(false); }
  };

  useEffect(() => { fetchStatus(); }, []);

  const connectFreshdesk = async () => {
    if (!apiKey || !domain) {
      toast({ title: "Both API key and domain are required", status: "warning", duration: 3000 });
      return;
    }
    setConnecting(true);
    try {
      await freshdeskApi.connect({ apiKey, domain });
      toast({ title: "Freshdesk connected!", status: "success", duration: 3000 });
      fetchStatus(); setApiKey(""); setDomain("");
    } catch (e: any) {
      toast({ title: "Connection failed", description: e?.response?.data?.message ?? "Check your credentials", status: "error", duration: 4000 });
    } finally { setConnecting(false); }
  };

  const connectHubspot = async () => {
    try {
      const res = await hubspotApi.getAuthUrl();
      window.location.href = res.data.url;
    } catch { toast({ title: "Failed to get HubSpot auth URL", status: "error", duration: 3000 }); }
  };

  if (loading) return <Center minH="60vh"><Spinner size="xl" color="brand.500" thickness="3px" /></Center>;

  return (
    <Box maxW="3xl" mx="auto" py="8" px="4">
      <Box mb="10">
        <Heading fontSize="2xl" fontWeight="900" color="gray.900" letterSpacing="-0.03em">
          Connect Accounts
        </Heading>
        <Text fontSize="xs" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.12em" mt="1">
          Link your Freshdesk and HubSpot accounts
        </Text>
      </Box>

      <VStack spacing="6" align="stretch">
        {/* Freshdesk Card */}
        <Box bg="white" border="1px solid" borderColor={status?.freshdesk ? "green.200" : "gray.100"}
          borderRadius="2xl" p="7" boxShadow="sm">
          <HStack justify="space-between" mb="5">
            <HStack spacing="3">
              <Box w="10" h="10" bg="green.50" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                <Zap size={20} color="#16a34a" />
              </Box>
              <Box>
                <Text fontWeight="800" color="gray.900">Freshdesk</Text>
                <Text fontSize="xs" color="gray.400">API Key Authentication</Text>
              </Box>
            </HStack>
            <Badge colorScheme={status?.freshdesk ? "green" : "red"} borderRadius="full" px="3">
              <HStack spacing="1">
                {status?.freshdesk ? <CheckCircle size={12} /> : <XCircle size={12} />}
                <Text>{status?.freshdesk ? "Connected" : "Not Connected"}</Text>
              </HStack>
            </Badge>
          </HStack>

          {!status?.freshdesk ? (
            <VStack spacing="4" align="stretch">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">Freshdesk Domain</FormLabel>
                <Input value={domain} onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourcompany" h="11" borderRadius="lg" fontSize="sm" />
                <FormHelperText fontSize="xs">e.g. if your URL is acme.freshdesk.com, enter "acme"</FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="600" color="gray.700">API Key</FormLabel>
                <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Your Freshdesk API key" type="password" h="11" borderRadius="lg" fontSize="sm" />
                <FormHelperText fontSize="xs">Found in Freshdesk → Profile Settings → API Key</FormHelperText>
              </FormControl>
              <PrimaryButton onClick={connectFreshdesk} isLoading={connecting}>
                Connect Freshdesk
              </PrimaryButton>
            </VStack>
          ) : (
            <Text fontSize="sm" color="green.600" fontWeight="600">
              ✓ Your Freshdesk account is connected. Tickets are ready to view.
            </Text>
          )}
        </Box>

        {/* HubSpot Card */}
        <Box bg="white" border="1px solid" borderColor={status?.hubspot ? "orange.200" : "gray.100"}
          borderRadius="2xl" p="7" boxShadow="sm">
          <HStack justify="space-between" mb="5">
            <HStack spacing="3">
              <Box w="10" h="10" bg="orange.50" borderRadius="xl" display="flex" alignItems="center" justifyContent="center">
                <ExternalLink size={20} color="#ea580c" />
              </Box>
              <Box>
                <Text fontWeight="800" color="gray.900">HubSpot</Text>
                <Text fontSize="xs" color="gray.400">OAuth 2.0 Authentication</Text>
              </Box>
            </HStack>
            <Badge colorScheme={status?.hubspot ? "green" : "orange"} borderRadius="full" px="3">
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
              <PrimaryButton onClick={connectHubspot} bg="orange.500" _hover={{ bg: "orange.600" }}>
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
