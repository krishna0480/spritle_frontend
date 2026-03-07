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

export default function LoginPage() {
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
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p="6">
      <Box w="full" maxW="md" bg="white" borderRadius="2xl" boxShadow="xl" p="8" border="1px solid" borderColor="gray.100">
        <VStack spacing="2" mb="8" textAlign="center">
          <Heading fontSize="3xl" fontWeight="900" color="#0d1b2a" letterSpacing="-0.03em">
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
