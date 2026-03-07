// src/app/theming.ts — Chakra UI v2
import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

export const theme = extendTheme({
  config,
  fonts: {
    heading: "var(--font-dm-sans), 'DM Sans', sans-serif",
    body:    "var(--font-dm-sans), 'DM Sans', sans-serif",
    mono:    "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
  },
  colors: {
    brand: {
      50:  "#E6F0F4",
      100: "#B3D1DE",
      200: "#80B2C8",
      300: "#4D93B2",
      400: "#267A9F",
      500: "#04374E",
      600: "#032C3E",
      700: "#02212F",
      800: "#011620",
      900: "#000B10",
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
        bg: "gray.50",
        color: "gray.900",
        scrollBehavior: "smooth",
        WebkitFontSmoothing: "antialiased",
      },
    },
  },
  components: {
    Button: {
      baseStyle: { fontWeight: "700", borderRadius: "md" },
      defaultProps: { colorScheme: "brand" },
    },
    Input: {
      defaultProps: { focusBorderColor: "brand.500" },
    },
  },
});
