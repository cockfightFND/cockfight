import { defineConfig } from "vite"
import inject from "@rollup/plugin-inject"
import stdLibBrowser from "node-stdlib-browser"

const options = {
  global: [require.resolve("node-stdlib-browser/helpers/esbuild/shim"), "global"],
  process: [require.resolve("node-stdlib-browser/helpers/esbuild/shim"), "process"],
  Buffer: [require.resolve("node-stdlib-browser/helpers/esbuild/shim"), "Buffer"],
}

export default defineConfig({
  plugins: [{ ...inject(options), enforce: "post" }],
  resolve: { alias: stdLibBrowser },
  optimizeDeps: { include: ["process", "buffer"] },
})
