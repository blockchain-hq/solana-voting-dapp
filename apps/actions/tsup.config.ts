import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "api/[[...route]]": "src/api/[[...route]].ts",
  },
  format: ["esm"],
  target: "esnext",
  bundle: true,
  clean: true,
  minify: false,
  sourcemap: true,
  noExternal: [/@anchor\/voting/],
  splitting: false,
  outDir: ".",
  platform: "browser",
  banner: {
    js: "// @ts-nocheck",
  },
});
