"use client";

import React, { useEffect, useState } from "react";
import {
  Box, Heading, Text, VStack, HStack, Badge, Spinner,
  Center, Button, Collapse, Code,
} from "@chakra-ui/react";
import { RefreshCw, ChevronDown, ChevronUp, User, MessageCircle } from "lucide-react";
import { freshdeskApi, hubspotApi } from "@/src/config/api_client";

interface Ticket {
  id: number; subject: string; status: string; priority: string;
  createdAt: string; requester: { name: string | null; email: string | null };
}
interface Conversation {
  id: number; body: string; incoming: boolean; createdAt: string; fromEmail: string;
}
interface HubspotContact {
  name: string; email: string; phone: string | null; company: string | null; lifecycleStage: string | null;
}

const STATUS_COLOR: Record<string, string>   = { Open: "green", Pending: "yellow", Resolved: "blue", Closed: "gray" };
const PRIORITY_COLOR: Record<string, string> = { Low: "gray", Medium: "blue", High: "orange", Urgent: "red" };

export default function TicketsPage() {
  const [tickets, setTickets]           = useState<Ticket[]>([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [expanded, setExpanded]         = useState<number | null>(null);
  const [convos, setConvos]             = useState<Record<number, Conversation[]>>({});
  const [hubspot, setHubspot]           = useState<Record<string, HubspotContact | null>>({});
  const [loadingConvo, setLoadingConvo] = useState<number | null>(null);

  const fetchTickets = async () => {
    setLoading(true); setError(null);
    try {
      const res = await freshdeskApi.tickets();
      setTickets(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "Failed to load tickets. Is Freshdesk connected?");
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchTickets(); }, []);

  const toggleTicket = async (ticket: Ticket) => {
    if (expanded === ticket.id) { setExpanded(null); return; }
    setExpanded(ticket.id);
    if (!convos[ticket.id]) {
      setLoadingConvo(ticket.id);
      try {
        const cRes = await freshdeskApi.conversations(String(ticket.id));
        setConvos((p) => ({ ...p, [ticket.id]: cRes.data }));
        const email = ticket.requester.email;
        if (email && hubspot[email] === undefined) {
          try {
            const hRes = await hubspotApi.contact(email);
            setHubspot((p) => ({ ...p, [email]: hRes.data.found ? hRes.data.contact : null }));
          } catch { setHubspot((p) => ({ ...p, [email]: null })); }
        }
      } finally { setLoadingConvo(null); }
    }
  };

  if (loading) return <Center minH="60vh"><Spinner size="xl" color="brand.500" thickness="3px" /></Center>;

  return (
    <Box maxW="5xl" mx="auto" py="8" px="4">
      <HStack justify="space-between" mb="8">
        <Box>
          <Heading fontSize="2xl" fontWeight="900" color="gray.900" letterSpacing="-0.03em">
            Freshdesk Tickets
          </Heading>
          <Text fontSize="xs" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.12em" mt="1">
            {tickets.length} ticket{tickets.length !== 1 ? "s" : ""} loaded
          </Text>
        </Box>
        <Button size="sm" variant="outline" onClick={fetchTickets} borderRadius="lg" leftIcon={<RefreshCw size={14} />}>
          Refresh
        </Button>
      </HStack>

      {error && (
        <Box p="6" bg="red.50" border="1px solid" borderColor="red.100" borderRadius="2xl" mb="6">
          <Text color="red.600" fontWeight="600">{error}</Text>
        </Box>
      )}

      <VStack spacing="3" align="stretch">
        {tickets.map((ticket) => {
          const isOpen    = expanded === ticket.id;
          const email     = ticket.requester.email ?? "";
          const hsContact = hubspot[email];

          return (
            <Box key={ticket.id} bg="white" border="1px solid"
              borderColor={isOpen ? "blue.200" : "gray.100"}
              borderRadius="2xl" overflow="hidden"
              boxShadow={isOpen ? "sm" : "xs"} transition="all 0.2s">

              <HStack p="5" cursor="pointer" onClick={() => toggleTicket(ticket)}
                _hover={{ bg: "gray.50" }} justify="space-between" align="start" spacing="4">
                <VStack align="start" spacing="1.5" flex="1" minW="0">
                  <HStack spacing="2" flexWrap="wrap">
                    <Text fontSize="xs" color="gray.400" fontFamily="mono">#{ticket.id}</Text>
                    <Badge colorScheme={STATUS_COLOR[ticket.status] ?? "gray"} borderRadius="full" px="2" fontSize="xs">
                      {ticket.status}
                    </Badge>
                    <Badge colorScheme={PRIORITY_COLOR[ticket.priority] ?? "gray"} variant="outline" borderRadius="full" px="2" fontSize="xs">
                      {ticket.priority}
                    </Badge>
                  </HStack>
                  <Text fontWeight="700" color="gray.900" fontSize="sm" noOfLines={1}>{ticket.subject}</Text>
                  <HStack spacing="1" color="gray.400">
                    <User size={12} />
                    <Text fontSize="xs">{ticket.requester.name ?? ticket.requester.email ?? "Unknown"}</Text>
                  </HStack>
                </VStack>
                <Box color="gray.400" flexShrink={0} mt="1">
                  {loadingConvo === ticket.id ? <Spinner size="sm" /> : isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Box>
              </HStack>

              <Collapse in={isOpen} animateOpacity>
                <Box borderTop="1px solid" borderColor="gray.100" p="5">
                  <Box display={{ md: hsContact !== undefined ? "grid" : "block" }}
                    gridTemplateColumns="1fr 280px" style={{ gap: "1.5rem" }}>

                    {/* Conversations */}
                    <Box>
                      <HStack spacing="2" mb="4">
                        <MessageCircle size={15} color="#6b7280" />
                        <Text fontSize="sm" fontWeight="700" color="gray.700">Conversation Thread</Text>
                      </HStack>
                      <VStack spacing="3" align="stretch">
                        {(convos[ticket.id] ?? []).length === 0 && (
                          <Text fontSize="sm" color="gray.400" fontStyle="italic">No conversation yet.</Text>
                        )}
                        {(convos[ticket.id] ?? []).map((c) => (
                          <Box key={c.id} p="4" borderRadius="xl"
                            bg={c.incoming ? "blue.50" : "gray.50"}
                            border="1px solid" borderColor={c.incoming ? "blue.100" : "gray.100"}
                            ml={c.incoming ? "0" : "6"}>
                            <HStack justify="space-between" mb="2">
                              <Text fontSize="xs" fontWeight="700" color={c.incoming ? "blue.600" : "gray.600"}>
                                {c.incoming ? `Customer — ${c.fromEmail}` : "Support Agent"}
                              </Text>
                              <Text fontSize="xs" color="gray.400">
                                {new Date(c.createdAt).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                              </Text>
                            </HStack>
                            <Text fontSize="sm" color="gray.700" whiteSpace="pre-line">{c.body}</Text>
                          </Box>
                        ))}
                      </VStack>
                    </Box>

                    {/* HubSpot panel */}
                    {hsContact !== undefined && (
                      <Box>
                        <Text fontSize="sm" fontWeight="700" color="gray.700" mb="4">HubSpot Contact</Text>
                        {hsContact === null ? (
                          <Box p="4" bg="gray.50" borderRadius="xl" border="1px dashed" borderColor="gray.200">
                            <Text fontSize="sm" color="gray.400" textAlign="center">No matching contact</Text>
                          </Box>
                        ) : (
                          <Box p="5" bg="purple.50" border="1px solid" borderColor="purple.100" borderRadius="xl">
                            <VStack align="start" spacing="3">
                              <Box w="10" h="10" borderRadius="full" bg="purple.200"
                                display="flex" alignItems="center" justifyContent="center">
                                <User size={18} color="#7c3aed" />
                              </Box>
                              {([
                                ["Name",    hsContact.name],
                                ["Email",   hsContact.email],
                                ["Phone",   hsContact.phone ?? "—"],
                                ["Company", hsContact.company ?? "—"],
                                ["Stage",   hsContact.lifecycleStage ?? "—"],
                              ] as [string, string][]).map(([label, val]) => (
                                <Box key={label}>
                                  <Text fontSize="xs" fontWeight="700" color="purple.500"
                                    textTransform="uppercase" letterSpacing="0.08em">{label}</Text>
                                  <Text fontSize="sm" color="gray.800" fontWeight="500">{val}</Text>
                                </Box>
                              ))}
                            </VStack>
                          </Box>
                        )}
                      </Box>
                    )}
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
