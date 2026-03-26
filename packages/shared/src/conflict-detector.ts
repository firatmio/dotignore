import type { Conflict } from "./index.js";

interface ParsedRule {
  line: number;
  raw: string;
  pattern: string;
  isNegation: boolean;
  isComment: boolean;
  isBlank: boolean;
}

function parseRules(lines: string[]): ParsedRule[] {
  return lines.map((raw, i) => {
    const trimmed = raw.trim();
    return {
      line: i + 1,
      raw: trimmed,
      pattern: trimmed.startsWith("!") ? trimmed.slice(1) : trimmed,
      isNegation: trimmed.startsWith("!") && trimmed.length > 1,
      isComment: trimmed.startsWith("#"),
      isBlank: trimmed === "",
    };
  });
}

function patternsOverlap(broad: string, specific: string): boolean {
  // *.ext kapsar → specific.ext
  if (broad.startsWith("*.")) {
    const ext = broad.slice(1); // ".log"
    if (specific.endsWith(ext)) return true;
  }
  // dir/ kapsar → dir/subpath veya dir/**
  if (broad.endsWith("/")) {
    if (specific.startsWith(broad) || specific === broad.slice(0, -1)) return true;
  }
  // Tam eşleşme
  if (broad === specific) return true;
  // dir/** kapsar → dir/something
  if (broad.endsWith("/**")) {
    const base = broad.slice(0, -3);
    if (specific.startsWith(base + "/")) return true;
  }
  return false;
}

export function detectConflicts(content: string): Conflict[] {
  const lines = content.split("\n");
  const parsed = parseRules(lines);
  const activeRules = parsed.filter((r) => !r.isComment && !r.isBlank);
  const conflicts: Conflict[] = [];

  for (let i = 0; i < activeRules.length; i++) {
    const rule = activeRules[i]!;

    // 1. Negation override: !file geldiğinde, önceki bir geniş kural onu geçersiz kılıyor mu?
    if (rule.isNegation) {
      for (let j = 0; j < i; j++) {
        const prev = activeRules[j]!;
        if (prev.isNegation) continue;
        if (patternsOverlap(prev.pattern, rule.pattern)) {
          conflicts.push({
            type: "negation-override",
            severity: "warning",
            message: `"${rule.raw}" (satır ${rule.line}) negation kuralı, ancak "${prev.raw}" (satır ${prev.line}) tarafından geçersiz kılınabilir. Negation'ın çalışması için doğru sıralama gerekir.`,
            lines: [prev.line, rule.line],
          });
        }
      }
    }

    // 2. Duplicate: aynı pattern birden fazla kez
    for (let j = i + 1; j < activeRules.length; j++) {
      const other = activeRules[j]!;
      if (rule.raw === other.raw) {
        conflicts.push({
          type: "duplicate",
          severity: "warning",
          message: `"${rule.raw}" tekrar ediyor (satır ${rule.line} ve ${other.line}).`,
          lines: [rule.line, other.line],
        });
      }
    }

    // 3. Redundant: dir/ varken dir/** gereksiz (veya tersi)
    if (!rule.isNegation) {
      for (let j = i + 1; j < activeRules.length; j++) {
        const other = activeRules[j]!;
        if (other.isNegation) continue;

        const a = rule.pattern;
        const b = other.pattern;

        if (
          (a.endsWith("/") && b === a.slice(0, -1) + "/**") ||
          (b.endsWith("/") && a === b.slice(0, -1) + "/**")
        ) {
          conflicts.push({
            type: "redundant",
            severity: "warning",
            message: `"${rule.raw}" (satır ${rule.line}) ve "${other.raw}" (satır ${other.line}) birbirini kapsıyor — biri gereksiz.`,
            lines: [rule.line, other.line],
          });
        }
      }
    }
  }

  return conflicts;
}
