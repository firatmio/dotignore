<div align="center">

# dotignore

<p align="center">
  <a href="https://dotignore.vercel.app">
    <img src="apps/web/public/logo.svg" alt="dotignore" width="64" height="64" />
  </a>
</p>

<p align="center">
  Smart <code>.gitignore</code> generator with AI-powered suggestions and conflict detection.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@ftarslan/dotignore">
    <img src="https://img.shields.io/npm/v/%40ftarslan%2Fdotignore?style=flat-square&label=npm&color=CB3837" alt="npm version" />
  </a>
  <a href="https://www.npmjs.com/package/@ftarslan/dotignore">
    <img src="https://img.shields.io/npm/dm/%40ftarslan%2Fdotignore?style=flat-square&color=CB3837" alt="npm downloads" />
  </a>
  <a href="https://github.com/firatmio/dotignore/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/firatmio/dotignore?style=flat-square&color=0ea5e9" alt="license" />
  </a>
  <a href="https://github.com/firatmio/dotignore/stargazers">
    <img src="https://img.shields.io/github/stars/firatmio/dotignore?style=flat-square&color=f59e0b" alt="stars" />
  </a>
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen?style=flat-square" alt="node version" />
  <img src="https://img.shields.io/badge/built%20with-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <a href="https://dotignore.vercel.app">Website</a>
  &nbsp;&middot;&nbsp;
  <a href="https://dotignore.vercel.app/dashboard">Dashboard</a>
  &nbsp;&middot;&nbsp;
  <a href="#cli">CLI Docs</a>
  &nbsp;&middot;&nbsp;
  <a href="https://dotignore.vercel.app/dashboard/docs">API Docs</a>
</p>

</div>

---

## Overview

dotignore is a full-stack developer tool that generates clean, conflict-free `.gitignore` files. It ships as a web application with a dashboard and REST API, and as a standalone CLI that works offline with 17 built-in templates.

**Web app** — interactive generator, AI suggestions, API key management, usage analytics.

**CLI** — works offline, scriptable, supports auto-detection and non-interactive modes.

---

## CLI

### Installation

```sh
# Global install
npm install -g @ftarslan/dotignore

# Or run without installing
npx @ftarslan/dotignore <command>
```

### Commands

| Command | Description |
|---------|-------------|
| `dotignore list` | Browse all available templates |
| `dotignore init` | Create a `.gitignore` interactively |
| `dotignore ai` | Generate with AI-powered suggestions (API key required) |
| `dotignore check [path]` | Analyze a `.gitignore` for conflicts and duplicate rules |

### `dotignore list`

```sh
dotignore list                        # all templates
dotignore list --category language    # filter by category
dotignore list --search docker        # search by name
dotignore list --ids                  # print IDs only (pipe-friendly)
```

### `dotignore init`

```sh
dotignore init                              # interactive
dotignore init --templates node,nextjs,vscode
dotignore init --detect                     # auto-detect from current directory
dotignore init --templates node --dry-run   # preview without writing
dotignore init --templates node --force     # skip overwrite prompt
dotignore init --templates node --merge     # append to existing file
dotignore init --output .config/.gitignore  # custom output path
```

**Auto-detect** scans the current directory for `package.json`, `go.mod`, `Cargo.toml`, `requirements.txt`, `next.config.*`, `.vscode/`, `.idea/` and similar files to pre-select matching templates.

### `dotignore ai`

Requires an API key from [dotignore.vercel.app/dashboard](https://dotignore.vercel.app/dashboard).

```sh
dotignore ai --key <your-api-key>
dotignore ai --key <key> --description "Next.js monorepo with Prisma and Docker"
dotignore ai --key <key> --templates node,nextjs --dry-run

# Or set the key as an environment variable
export DOTIGNORE_API_KEY=<your-api-key>
dotignore ai
```

### `dotignore check`

```sh
dotignore check                          # checks .gitignore in current directory
dotignore check path/to/.gitignore
dotignore check --fix                    # auto-remove exact duplicate rules
```

Exit code `1` when errors are found — integrates cleanly with CI pipelines.

### Available Templates

| Category | Templates |
|----------|-----------|
| Languages | `node` `python` `java` `go` `rust` `csharp` `swift` |
| Frameworks | `nextjs` `django` `rails` `laravel` `flutter` |
| IDEs | `vscode` `jetbrains` |
| OS | `macos` `windows` `linux` |

---

## REST API

The API is available at `https://dotignore.vercel.app/api`. All endpoints except `/api/templates` require a Bearer token.

### `POST /api/generate`

```sh
curl -X POST https://dotignore.vercel.app/api/generate \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"templates": ["node", "nextjs", "vscode"]}'
```

### `POST /api/generate/ai`

```sh
curl -X POST https://dotignore.vercel.app/api/generate/ai \
  -H "Authorization: Bearer <api-key>" \
  -H "Content-Type: application/json" \
  -d '{"templates": ["node"], "projectDescription": "Next.js app with Prisma"}'
```

### `GET /api/templates`

```sh
curl https://dotignore.vercel.app/api/templates
```

---

## Monorepo Structure

```
dotignore/
├── apps/
│   └── web/                  # Next.js web application (App Router)
├── packages/
│   ├── cli/                  # @ftarslan/dotignore — CLI tool
│   ├── shared/               # Shared types, schemas, conflict detector
│   └── templates/            # .gitignore template definitions
├── turbo.json
└── package.json
```

Built with [Turborepo](https://turbo.build) and [Bun](https://bun.sh).

### Tech Stack

**Web:** Next.js 16, React 19, Tailwind CSS v4, Shadcn/ui, Supabase  
**CLI:** Commander, Inquirer, Chalk, Ora  
**Monorepo:** Turborepo, Bun workspaces, TypeScript

---

## Development

```sh
git clone https://github.com/firatmio/dotignore
cd dotignore
bun install

# Start web app
bun dev --filter=web

# Build CLI
bun build --filter=@ftarslan/dotignore
```

Copy `.env.example` to `.env.local` and fill in the required Supabase and OpenAI keys before starting the web app.

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## License

[MIT](LICENSE) — Firat Arslan
