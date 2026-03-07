"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Heading, Text, VStack, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { SignupForm } from "../forms";
import { SIGNUP_FIELDS, signupSchema, SignupValues } from "../schema/signup_schema";
import { authApi } from "@/src/config/api_client";

export default function SignupPage() {
  const router = useRouter();
  const toast  = useToast();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    mode: "onSubmit",
    defaultValues: { name: "", email: "", password: "", confirm_password: "" },
  });

  const handleSignup = async (values: SignupValues) => {
    try {
      await authApi.signup({ name: values.name, email: values.email, password: values.password });
      toast({ title: "Account created!", description: "Please log in.", status: "success", duration: 4000 });
      router.push("/login");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "An unexpected error occurred.";
      if (msg.toLowerCase().includes("already")) {
        form.setError("email", { message: "This email is already registered." });
      } else {
        toast({ title: "Signup failed", description: msg, status: "error", duration: 4000 });
      }
    }
  };

  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50" p="6">
      <Box w="full" maxW="md" bg="white" borderRadius="2xl" boxShadow="xl" p="8" border="1px solid" borderColor="gray.100">
        <VStack spacing="2" mb="8" textAlign="center">
          <Heading fontSize="3xl" fontWeight="900" color="#0d1b2a" letterSpacing="-0.03em">
            Create Account
          </Heading>
          <Text color="gray.500" fontSize="sm">Join the Spritle integration portal</Text>
        </VStack>
        <SignupForm
          form={form} onSubmit={handleSignup} fields={SIGNUP_FIELDS}
          submitbuttonValue="Sign Up"
          footerLink={{ text: "Already have an account?", linkText: "Log in", href: "/login" }}
        />
      </Box>
    </Box>
  );
}
