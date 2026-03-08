// src/app/theming.ts — Chakra UI v2
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
    fonts: {
      heading: "var(--font-poppins), 'Poppins', sans-serif",
      body:    "var(--font-poppins), 'Poppins', sans-serif",
      mono:    "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
    },
  colors: {
    brand: {
      50:  "#e6f7f4",
      100: "#b3e8df",
      200: "#80d9ca",
      300: "#4dcab5",
      400: "#26be9f",
      500: "#0d9f83",
      600: "#097a64",
      700: "#065645",
      800: "#033126",
      900: "#010d0a",
    },
    ocean: {
      500: "#1a5fa0",
      600: "#14497c",
    },
  },
  radii: {
    sm:    "0.375rem",
    md:    "0.5rem",
    lg:    "0.75rem",
    xl:    "1rem",
    "2xl": "1.5rem",
    "3xl": "2rem",
    full:  "9999px",
  },
  styles: {
    global: {
      "html, body": {
        background: "linear-gradient(135deg, #0d4f6e 0%, #0a7c5c 35%, #1a6b8a 65%, #0d9f83 100%)",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
        color: "gray.900",
        scrollBehavior: "smooth",
        WebkitFontSmoothing: "antialiased",
      },
    },
  },
  components: {
    Button: {
      baseStyle: { fontWeight: "700", borderRadius: "xl" },
      defaultProps: { colorScheme: "brand" },
    },
    Input: {
      defaultProps: { focusBorderColor: "brand.500" },
    },
  },
});
