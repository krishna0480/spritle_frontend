"use client";

import { UseFormReturn, FieldValues, Path, Controller } from "react-hook-form";
import { VStack, Text, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";
import { SignupFieldConfig } from "../type";
import { PrimaryButton } from "@/src/shared/components/primary_button";
import { FormInput } from "@/src/shared/components/input_field";

interface SignupFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  fields: SignupFieldConfig[];
  submitbuttonValue: string;
  footerLink?: { text: string; linkText: string; href: string };
}

export function SignupForm<T extends FieldValues>({
  form, onSubmit, fields, submitbuttonValue, footerLink,
}: SignupFormProps<T>) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <VStack spacing="5" align="stretch">
        {fields.map((config) => (
          <Controller
            key={config.id}
            control={form.control}
            name={config.id as Path<T>}
            render={({ field, fieldState }) => (
              <FormInput
                field={field}
                label={config.label}
                placeholder={config.placeholder}
                type={config.id.toLowerCase().includes("password") ? "password" : "text"}
                error={fieldState.error?.message}
              />
            )}
          />
        ))}
        <PrimaryButton type="submit" isLoading={form.formState.isSubmitting} mt="2">
          {submitbuttonValue}
        </PrimaryButton>
        {footerLink && (
          <Text textAlign="center" fontSize="sm" color="gray.500">
            {footerLink.text}{" "}
            <ChakraLink as={NextLink} href={footerLink.href} color="blue.600" fontWeight="700">
              {footerLink.linkText}
            </ChakraLink>
          </Text>
        )}
      </VStack>
    </form>
  );
}
