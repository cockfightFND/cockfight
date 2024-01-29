import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { To, NavigateOptions } from "react-router-dom"

const useRedirectOnEmpty = (deps: string[], path: [to: To, options?: NavigateOptions]) => {
  const navigate = useNavigate()
  useEffect(() => {
    if (deps.some((dep) => !dep)) navigate(...path)
  }, [deps, navigate, path])
}

export default useRedirectOnEmpty
