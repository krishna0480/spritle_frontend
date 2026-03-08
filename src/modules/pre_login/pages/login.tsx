"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SignupForm } from "../forms";
import { LOGIN_FIELDS, loginSchema, LoginValues } from "../schema/login_schema";
import { authApi } from "@/src/config/api_client";
import { useAuth } from "@/src/app/auth_provider";
import { ErrorBoundary } from "@/src/shared/components";

export default function LoginPage() {
  return (
    <ErrorBoundary fallbackTitle="Login page failed to load">
      <LoginContent />
    </ErrorBoundary>
  );
}

function LoginContent() {
  const router = useRouter();
  const { setToken } = useAuth();
  const toast = useToast();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleLogin = async (values: LoginValues) => {
    try {
      const res = await authApi.login(values);
      const token = res.data?.data?.token ?? res.data?.token;
      if (token) { setToken(token); router.push("/dashboard"); }
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err?.response?.data?.message ?? "Invalid email or password.",
        status: "error", duration: 4000, isClosable: true,
      });
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" p="6">
      <Box w="full" maxW="md" bg="white" borderRadius="3xl"
        boxShadow="0 25px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.15)"
        p="10">
        <VStack spacing="2" mb="8" textAlign="center">
          <Box w="12" h="12" bg="linear-gradient(135deg, #0d4f6e, #0d9f83)" borderRadius="2xl"
            display="flex" alignItems="center" justifyContent="center" mb="2"
            boxShadow="0 8px 20px rgba(13,79,110,0.4)">
            <Box w="5" h="5" borderRadius="full" bg="white" opacity={0.9} />
          </Box>
          <Heading fontSize="3xl" fontWeight="900" color="gray.900" letterSpacing="-0.03em">
            Welcome Back
          </Heading>
          <Text color="gray.500" fontSize="sm">Log in to your account</Text>
        </VStack>
        <SignupForm
          form={form} onSubmit={handleLogin} fields={LOGIN_FIELDS}
          submitbuttonValue="Log In"
          footerLink={{ text: "Don't have an account?", linkText: "Sign up", href: "/sign_up" }}
        />
      </Box>
    </Box>
  );

}
