import { useEffect, useRef } from "react"

const useUnmount = (effect: () => void) => {
  const init = useRef(false)
  const effectRef = useRef(effect)
  effectRef.current = effect

  useEffect(() => {
    return () => {
      if (init.current) return effectRef.current()
      init.current = true
    }
  }, [])
}

export default useUnmount
