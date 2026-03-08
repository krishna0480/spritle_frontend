"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Heading, Text, VStack, HStack, Badge,
  Spinner, Center, Button, Collapse, Code,
} from "@chakra-ui/react";
import { RefreshCw, ChevronDown, ChevronUp, Radio, Zap } from "lucide-react";
import { webhookApi } from "@/src/config/api_client";
import { ErrorBoundary } from "@/src/shared/components";

interface WebhookLog {
  id: string; eventType: string;
  payload: Record<string, any>; receivedAt: string;
}

const EVENT_COLOR: Record<string, string> = {
  ticket_created: "green", ticket_updated: "blue",
};

export default function WebhooksPage() {
  return (
    <ErrorBoundary fallbackTitle="Webhook logs failed to load">
      <WebhooksContent />
    </ErrorBoundary>
  );
}

function WebhooksContent() {
  const [logs, setLogs]             = useState<WebhookLog[]>([]);
  const [loading, setLoading]       = useState(true);
  const [expanded, setExpanded]     = useState<string | null>(null);
  const [error, setError]           = useState<string | null>(null);
  const [triggering, setTriggering] = useState(false);
  const [triggerSuccess, setTriggerSuccess] = useState(false);

  const fetchLogs = async () => {
    setLoading(true); setError(null);
    try {
      const res = await webhookApi.logs(100);
      setLogs(res.data);
    } catch { setError("Failed to load webhook logs."); }
    finally { setLoading(false); }
  };

  // ✅ Trigger test webhook then refresh logs
  const triggerTestWebhook = async () => {
    setTriggering(true); setTriggerSuccess(false); setError(null);
    try {
      await webhookApi.trigger();
      setTriggerSuccess(true);
      await fetchLogs();
      setTimeout(() => setTriggerSuccess(false), 3000);
    } catch {
      setError("Failed to trigger test webhook.");
    } finally {
      setTriggering(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  if (loading) return (
    <Center minH="60vh">
      <Spinner size="xl" color="white" thickness="3px" />
    </Center>
  );

  return (
    <Box maxW="5xl" mx="auto">
      <HStack justify="space-between" mb="8" flexWrap="wrap" gap="3">
        <Box>
          <Heading fontSize="2xl" fontWeight="900" color="white" letterSpacing="-0.03em">
            Webhook Logs
          </Heading>
          <Text fontSize="xs" color="whiteAlpha.700" fontWeight="600"
            textTransform="uppercase" letterSpacing="0.12em" mt="1">
            {logs.length} event{logs.length !== 1 ? "s" : ""} received
          </Text>
        </Box>

        <HStack spacing="3">
          {/* ✅ Trigger Test Webhook
          <Button
            size="sm"
            colorScheme="green"
            borderRadius="lg"
            leftIcon={<Zap size={14} />}
            onClick={triggerTestWebhook}
            isLoading={triggering}
            loadingText="Triggering..."
          >
            Trigger Test Webhook
          </Button> */}

          <Button size="sm" onClick={fetchLogs} borderRadius="lg" leftIcon={<RefreshCw size={14} />}
            bg="whiteAlpha.200" color="white" border="1px solid" borderColor="whiteAlpha.400"
            _hover={{ bg: "whiteAlpha.300" }} backdropFilter="blur(10px)">
            Refresh
          </Button>
        </HStack>
      </HStack>

      {/* ✅ Success banner */}
      {triggerSuccess && (
        <Box p="4" bg="green.50" border="1px solid" borderColor="green.200"
          borderRadius="xl" mb="4">
          <Text color="green.700" fontWeight="600" fontSize="sm">
            ✅ Test webhook triggered successfully!
          </Text>
        </Box>
      )}

      {error && (
        <Box p="6" bg="red.50" border="1px solid" borderColor="red.100"
          borderRadius="2xl" mb="6">
          <Text color="red.600" fontWeight="600">{error}</Text>
        </Box>
      )}

      {logs.length === 0 && !error && (
        <Box p="16" textAlign="center" bg="white" borderRadius="2xl"
          border="1px dashed" borderColor="gray.200">
          <Box mb="4" display="flex" justifyContent="center">
            <Radio size={32} color="#94a3b8" />
          </Box>
          <Text fontWeight="700" color="gray.400" mb="2">No webhook events yet</Text>
          <Text fontSize="sm" color="gray.400" mb="4">
            Configure a webhook in Freshdesk pointing to{" "}
            <Code fontSize="xs" px="2" py="0.5" borderRadius="md">
              /webhook/freshdesk
            </Code>
          </Text>
          {/* ✅ Trigger button in empty state too */}
          <Button
            size="sm"
            colorScheme="green"
            borderRadius="lg"
            leftIcon={<Zap size={14} />}
            onClick={triggerTestWebhook}
            isLoading={triggering}
            loadingText="Triggering..."
          >
            Trigger Test Webhook
          </Button>
        </Box>
      )}

      <VStack spacing="3" align="stretch">
        {logs.map((log) => {
          const isOpen = expanded === log.id;
          return (
            <Box key={log.id} bg="white" border="1px solid"
              borderColor={isOpen ? "teal.200" : "gray.100"}
              borderRadius="xl" overflow="hidden"
              boxShadow={isOpen ? "0 8px 25px rgba(0,0,0,0.12)" : "0 4px 12px rgba(0,0,0,0.07)"}
              transition="all 0.15s">
              <HStack p="4" cursor="pointer"
                onClick={() => setExpanded(isOpen ? null : log.id)}
                _hover={{ bg: "gray.50" }} justify="space-between">
                <HStack spacing="3" flexWrap="wrap">
                  <Badge
                    colorScheme={EVENT_COLOR[log.eventType] ?? "gray"}
                    borderRadius="full" px="2.5" fontSize="xs">
                    {log.eventType}
                  </Badge>
                  <Text fontSize="xs" color="gray.400" fontFamily="mono">
                    {new Date(log.receivedAt).toLocaleString("en-IN", {
                      dateStyle: "medium", timeStyle: "short",
                    })}
                  </Text>
                </HStack>
                <Box color="gray.400">
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </Box>
              </HStack>
              <Collapse in={isOpen} animateOpacity>
                <Box borderTop="1px solid" borderColor="gray.100" p="4">
                  <Text fontSize="xs" fontWeight="700" color="gray.500"
                    textTransform="uppercase" letterSpacing="0.1em" mb="2">
                    Payload
                  </Text>
                  <Box bg="gray.900" borderRadius="xl" p="4"
                    overflowX="auto" maxH="400px" overflowY="auto">
                    <Code display="block" whiteSpace="pre" fontSize="xs"
                      color="green.300" bg="transparent" fontFamily="mono">
                      {JSON.stringify(log.payload, null, 2)}
                    </Code>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </VStack>
    </Box>
  );
}