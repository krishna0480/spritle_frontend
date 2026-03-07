import { z } from "zod";
import { SignupFieldConfig } from "../type";

export const SIGNUP_FIELDS: SignupFieldConfig[] = [
  { id: "name",             label: "Full Name",       type: "INPUT", placeholder: "John Doe",          is_required: true },
  { id: "email",            label: "Email Address",   type: "INPUT", placeholder: "your@email.com",    is_required: true },
  { id: "password",         label: "Password",        type: "INPUT", placeholder: "Min 6 characters",  is_required: true },
  { id: "confirm_password", label: "Confirm Password",type: "INPUT", placeholder: "Repeat password",   is_required: true },
];

export const signupSchema = z.object({
  name:             z.string().min(1, "Name is required"),
  email:            z.string().email("Invalid email address"),
  password:         z.string().min(6, "Password must be at least 6 characters"),
  confirm_password: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

export type SignupValues = z.infer<typeof signupSchema>;
