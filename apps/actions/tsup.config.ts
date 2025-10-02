import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/api/[[...route]].ts"],
  format: ["esm"],
  target: "esnext",
  bundle: true,
  clean: true,
  minify: false,
  sourcemap: true,
  noExternal: [/.*/], // Bundle everything
  splitting: false,
  outDir: "api",
  platform: "neutral",
  banner: {
    js: "// @ts-nocheck",
  },
});
