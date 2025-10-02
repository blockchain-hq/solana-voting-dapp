import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs"],
  target: "node18",
  bundle: true,
  clean: true,
  minify: false,
  sourcemap: true,
  noExternal: ["@anchor/voting"], // Force bundling of this workspace dependency
  splitting: false,
  treeshake: true,
});
