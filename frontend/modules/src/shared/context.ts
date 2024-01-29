import { createContext } from "@initia/react-api"
import type { Context } from "../components/ModuleProvider"

export const [useProps, PropsProvider] = createContext<Context>("Props")
export const useAddress = () => useProps().address ?? ""
