import { Box } from "@chakra-ui/react";
import { Sidebar } from "@/src/modules/home/component/navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box display={{ lg: "flex" }} minH="100vh" bg="gray.50">
      <Sidebar />
      <Box as="main" flex="1" minW="0" overflowY="auto">
        <Box p={{ base: "4", lg: "8" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
