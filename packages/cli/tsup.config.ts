import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  clean: true,
  dts: false,
  splitting: false,
  banner: {
    js: "#!/usr/bin/env node",
  },
  // Workspace packages export .ts source — bundle them
  noExternal: ["@dotignore/shared", "@dotignore/templates"],
});
