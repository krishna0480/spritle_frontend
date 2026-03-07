"use client";

import React, { useState, useEffect } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Box, VStack, HStack, Text, IconButton,
  Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerBody,
  Link as ChakraLink, useDisclosure,
} from "@chakra-ui/react";
import { Home, Calendar, Plug, Webhook, LogOut, Menu } from "lucide-react";
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { useAuth } from "@/src/app/auth_provider";

export const NAV_ITEMS = [
  { label: "Home",         href: "/dashboard",          icon: Home     },
  { label: "Tickets",      href: "/dashboard/tickets",  icon: Calendar },
  { label: "Connect",      href: "/dashboard/connect",  icon: Plug     },
  { label: "Webhook Logs", href: "/dashboard/webhooks", icon: Webhook  },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <VStack h="full" p="4" bg="white" align="stretch" spacing="0">
      <Box px="2" pb="6" pt="2" borderBottom="1px solid" borderColor="gray.100" mb="4">
        <Text fontSize="lg" fontWeight="900" color="#0d1b2a" letterSpacing="-0.04em">
          Spritle Portal
        </Text>
        <Text fontSize="xs" color="gray.400" fontWeight="600" textTransform="uppercase" letterSpacing="0.12em">
          Integration Dashboard
        </Text>
      </Box>

      <Text fontSize="xs" fontWeight="700" color="gray.400" textTransform="uppercase"
        letterSpacing="0.1em" px="2" mb="2">Menu</Text>

      <VStack align="stretch" spacing="1" flex="1">
        {NAV_ITEMS.map((item) => {
          const Icon     = item.icon;
          const isActive = pathname === item.href;
          return (
            <ChakraLink as={NextLink} key={item.href} href={item.href}
              onClick={onClose} _hover={{ textDecor: "none" }}>
              <HStack
                px="3" py="2.5" borderRadius="lg"
                bg={isActive ? "gray.100" : "transparent"}
                color={isActive ? "#0d1b2a" : "gray.500"}
                borderLeft={isActive ? "3px solid #0d1b2a" : "3px solid transparent"}
                borderLeftRadius={isActive ? "0" : "lg"}
                _hover={{ bg: "gray.50", color: "gray.900" }}
                transition="all 0.15s"
                cursor="pointer"
                spacing="3"
              >
                <Icon size={17} />
                <Text fontSize="sm" fontWeight="600">{item.label}</Text>
              </HStack>
            </ChakraLink>
          );
        })}
      </VStack>

      <Box mt="auto" pt="4" borderTop="1px solid" borderColor="gray.100">
        <PrimaryButton onClick={logout}>
          <HStack spacing="2">
            <LogOut size={16} />
            <Text>Logout</Text>
          </HStack>
        </PrimaryButton>
      </Box>
    </VStack>
  );
}

export function Sidebar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const pathname = usePathname();

  useEffect(() => { onClose(); }, [pathname]);

  return (
    <>
      {/* Mobile header */}
      <Box display={{ base: "flex", lg: "none" }} alignItems="center" h="16" px="4"
        borderBottom="1px solid" borderColor="gray.100" bg="white" position="sticky" top="0" zIndex="sticky">
        <IconButton aria-label="Open menu" variant="ghost" onClick={onOpen} mr="3" icon={<Menu size={22} />} />
        <Text fontSize="md" fontWeight="800" color="#0d1b2a" letterSpacing="-0.03em">Spritle Portal</Text>
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="left">
        <DrawerOverlay />
        <DrawerContent maxW="72">
          <DrawerCloseButton />
          <DrawerBody p="0">
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop sidebar */}
      <Box display={{ base: "none", lg: "flex" }} w="64" borderRight="1px solid" borderColor="gray.100"
        bg="white" h="100vh" position="sticky" top="0" flexDir="column" flexShrink={0}>
        <SidebarContent />
      </Box>
    </>
  );
}
