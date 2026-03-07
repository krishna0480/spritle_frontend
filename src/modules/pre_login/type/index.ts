export type DynamicFieldType = "INPUT" | "SELECT" | "RADIO" | "CHECKBOX";

export interface SignupFieldConfig {
  id: string;
  label: string;
  type: DynamicFieldType;
  placeholder?: string;
  options?: { id: string; value: string }[];
  is_required: boolean;
}
