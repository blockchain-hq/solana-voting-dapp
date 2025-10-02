import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  target: "node18",
  bundle: true,
  clean: true,
  minify: false,
  sourcemap: true,
  noExternal: ["@anchor/voting"],
  splitting: false,
  outDir: "api",
  outExtension: () => ({ js: ".js" }),
});
