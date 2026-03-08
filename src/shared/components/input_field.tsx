"use client";

import { useState } from "react";
import { FieldValues, Path, ControllerRenderProps } from "react-hook-form";
import {
  FormControl, FormLabel, FormErrorMessage,
  Input, InputGroup, InputRightElement, IconButton,
} from "@chakra-ui/react";
import { Eye, EyeOff } from "lucide-react";

interface FormInputProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  label: string;
  placeholder?: string;
  type?: string;
  error?: string;
}

export function FormInput<T extends FieldValues>({
  field, label, placeholder, type = "text", error,
}: FormInputProps<T>) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType  = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <FormControl isInvalid={!!error} w="full">
      <FormLabel fontSize="sm" fontWeight="600" color="gray.700" mb="1">
        {label}
      </FormLabel>
      <InputGroup>
        <Input
          {...field}
          type={inputType}
          placeholder={placeholder}
          value={(field.value as string) ?? ""}
          h="12"
          borderRadius="lg"
          borderColor="gray.200"
          fontSize="sm"
          bg="white"
          _placeholder={{ color: "gray.400" }}
          _focus={{ borderColor: "brand.500", boxShadow: "0 0 0 1px #0d9f83" }}
          pr={isPassword ? "12" : undefined}
        />
        {isPassword && (
          <InputRightElement h="12">
            <IconButton
              aria-label={showPassword ? "Hide" : "Show"}
              variant="ghost"
              size="sm"
              tabIndex={-1}
              onClick={() => setShowPassword((p) => !p)}
              icon={showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              color="gray.500"
              _hover={{ color: "gray.800", bg: "transparent" }}
            />
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage fontSize="xs" fontWeight="500">{error}</FormErrorMessage>
    </FormControl>
  );
}
