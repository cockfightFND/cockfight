import { mergeConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import svgr from "vite-plugin-svgr"
import polyfill from "./vite.polyfill"

export default mergeConfig(polyfill, {
  plugins: [react(), svgr()],
  build: { target: "esnext",
  rollupOptions: {
    external: ['@aptos-labs/wallet-adapter-react']
  } },
  envPrefix: "INITIA_",
  optimizeDeps: {
    include: ['@aptos-labs/wallet-adapter-react']
  },
})