// @dotignore/shared — ortak tipler, şemalar, yardımcı fonksiyonlar

export { detectConflicts } from "./conflict-detector";

export type TemplateSource = "github" | "custom";

export type TemplateCategory = "language" | "framework" | "os" | "ide";

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  source: TemplateSource;
  description: string;
  rules: string[];
}

export interface Conflict {
  type: "negation-override" | "duplicate" | "redundant" | "order-conflict";
  severity: "warning" | "error";
  message: string;
  lines: [number, number];
}

export interface GenerateRequest {
  templates: string[];
  source?: TemplateSource;
}

export interface GenerateAiRequest extends GenerateRequest {
  projectDescription?: string;
}

export interface GenerateResponse {
  content: string;
  conflicts: Conflict[];
  source: TemplateSource;
}

export interface AiSuggestion {
  rule: string;
  reason: string;
}

export interface GenerateAiResponse extends GenerateResponse {
  aiSuggestions: AiSuggestion[];
}
