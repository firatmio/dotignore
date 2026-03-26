import type { Template, TemplateCategory, TemplateSource } from "@dotignore/shared";

export interface TemplateFilter {
  category?: TemplateCategory;
  source?: TemplateSource;
}

const templates: Template[] = [
  // --- GitHub Kaynağı (Popüler) ---
  {
    id: "node",
    name: "Node.js",
    category: "language",
    source: "github",
    description: "Node.js projeleri için standart gitignore kuralları",
    rules: [
      "node_modules/",
      "dist/",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      "pnpm-debug.log*",
      "lerna-debug.log*",
      ".env",
      ".env.local",
      ".env.*.local",
      "coverage/",
      ".nyc_output/",
    ],
  },
  {
    id: "python",
    name: "Python",
    category: "language",
    source: "github",
    description: "Python projeleri için standart gitignore kuralları",
    rules: [
      "__pycache__/",
      "*.py[cod]",
      "*$py.class",
      "*.egg-info/",
      "dist/",
      "build/",
      ".env",
      ".venv/",
      "venv/",
      "*.egg",
      ".pytest_cache/",
      "htmlcov/",
      ".coverage",
    ],
  },
  {
    id: "java",
    name: "Java",
    category: "language",
    source: "github",
    description: "Java projeleri için standart gitignore kuralları",
    rules: [
      "*.class",
      "*.jar",
      "*.war",
      "*.ear",
      "target/",
      ".gradle/",
      "build/",
      "out/",
      ".settings/",
      ".project",
      ".classpath",
    ],
  },
  {
    id: "go",
    name: "Go",
    category: "language",
    source: "github",
    description: "Go projeleri için standart gitignore kuralları",
    rules: ["*.exe", "*.exe~", "*.dll", "*.so", "*.dylib", "*.test", "*.out", "vendor/"],
  },
  {
    id: "rust",
    name: "Rust",
    category: "language",
    source: "github",
    description: "Rust projeleri için standart gitignore kuralları",
    rules: ["target/", "Cargo.lock", "**/*.rs.bk"],
  },
  {
    id: "csharp",
    name: "C#",
    category: "language",
    source: "github",
    description: "C# / .NET projeleri için standart gitignore kuralları",
    rules: [
      "bin/",
      "obj/",
      "*.user",
      "*.userosscache",
      "*.suo",
      "*.cache",
      ".vs/",
      "packages/",
      "*.nupkg",
    ],
  },
  {
    id: "swift",
    name: "Swift",
    category: "language",
    source: "github",
    description: "Swift / Xcode projeleri için standart gitignore kuralları",
    rules: [
      ".build/",
      "DerivedData/",
      "*.xcodeproj/xcuserdata/",
      "*.xcworkspace/xcuserdata/",
      "*.pbxuser",
      "*.mode1v3",
      "*.mode2v3",
      "*.perspectivev3",
    ],
  },
  // --- OS ---
  {
    id: "macos",
    name: "macOS",
    category: "os",
    source: "github",
    description: "macOS sistem dosyaları",
    rules: [".DS_Store", ".AppleDouble", ".LSOverride", "Icon\r", "._*", ".Spotlight-V100", ".Trashes"],
  },
  {
    id: "windows",
    name: "Windows",
    category: "os",
    source: "github",
    description: "Windows sistem dosyaları",
    rules: ["Thumbs.db", "Thumbs.db:encryptable", "ehthumbs.db", "ehthumbs_vista.db", "Desktop.ini", "*.lnk"],
  },
  {
    id: "linux",
    name: "Linux",
    category: "os",
    source: "github",
    description: "Linux sistem dosyaları",
    rules: ["*~", ".fuse_hidden*", ".directory", ".Trash-*", ".nfs*"],
  },
  // --- IDE ---
  {
    id: "vscode",
    name: "VS Code",
    category: "ide",
    source: "github",
    description: "VS Code editör dosyaları",
    rules: [".vscode/*", "!.vscode/settings.json", "!.vscode/tasks.json", "!.vscode/launch.json", "!.vscode/extensions.json", "*.code-workspace"],
  },
  {
    id: "jetbrains",
    name: "JetBrains",
    category: "ide",
    source: "github",
    description: "JetBrains IDE dosyaları (IntelliJ, WebStorm, PyCharm vb.)",
    rules: [".idea/", "*.iml", "*.iws", "*.ipr", "out/", ".idea_modules/"],
  },
  // --- Custom Kaynağı (Framework-specific) ---
  {
    id: "nextjs",
    name: "Next.js",
    category: "framework",
    source: "custom",
    description: "Next.js projeleri için genişletilmiş gitignore kuralları",
    rules: [
      "node_modules/",
      ".next/",
      "out/",
      ".env",
      ".env.local",
      ".env.*.local",
      "npm-debug.log*",
      "yarn-debug.log*",
      "yarn-error.log*",
      ".vercel",
      "*.tsbuildinfo",
      "next-env.d.ts",
    ],
  },
  {
    id: "django",
    name: "Django",
    category: "framework",
    source: "custom",
    description: "Django projeleri için genişletilmiş gitignore kuralları",
    rules: [
      "__pycache__/",
      "*.py[cod]",
      "db.sqlite3",
      "db.sqlite3-journal",
      "media/",
      "staticfiles/",
      ".env",
      ".venv/",
      "*.egg-info/",
      "htmlcov/",
      ".coverage",
    ],
  },
  {
    id: "rails",
    name: "Ruby on Rails",
    category: "framework",
    source: "custom",
    description: "Ruby on Rails projeleri için genişletilmiş gitignore kuralları",
    rules: [
      "*.rbc",
      "capybara-*.html",
      ".rspec",
      "log/*",
      "tmp/*",
      "db/*.sqlite3",
      "db/*.sqlite3-journal",
      "public/system",
      "coverage/",
      "spec/tmp",
      ".env",
      "vendor/bundle",
    ],
  },
  {
    id: "laravel",
    name: "Laravel",
    category: "framework",
    source: "custom",
    description: "Laravel projeleri için genişletilmiş gitignore kuralları",
    rules: [
      "vendor/",
      "node_modules/",
      ".env",
      ".env.backup",
      "storage/*.key",
      "Homestead.json",
      "Homestead.yaml",
      "npm-debug.log",
      "yarn-error.log",
      "public/hot",
      "public/storage",
    ],
  },
  {
    id: "flutter",
    name: "Flutter",
    category: "framework",
    source: "custom",
    description: "Flutter / Dart projeleri için genişletilmiş gitignore kuralları",
    rules: [
      ".dart_tool/",
      ".packages",
      "build/",
      ".flutter-plugins",
      ".flutter-plugins-dependencies",
      "*.iml",
      ".idea/",
      ".pub-cache/",
      ".pub/",
      "/coverage/",
    ],
  },
];

export function getTemplates(filter?: TemplateFilter): Template[] {
  let result = templates;

  if (filter?.category) {
    result = result.filter((t) => t.category === filter.category);
  }

  if (filter?.source) {
    result = result.filter((t) => t.source === filter.source);
  }

  return result;
}

export function getTemplateById(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}

export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return templates.filter((t) => t.category === category);
}

export function mergeTemplates(ids: string[]): { content: string; rules: string[] } {
  const seen = new Set<string>();
  const sections: string[] = [];
  const allRules: string[] = [];

  for (const id of ids) {
    const template = getTemplateById(id);
    if (!template) continue;

    const uniqueRules = template.rules.filter((rule) => {
      if (seen.has(rule)) return false;
      seen.add(rule);
      return true;
    });

    if (uniqueRules.length > 0) {
      sections.push(`# === ${template.name} ===`);
      sections.push(...uniqueRules);
      sections.push("");
      allRules.push(...uniqueRules);
    }
  }

  return {
    content: sections.join("\n").trimEnd() + "\n",
    rules: allRules,
  };
}
