import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"

function useCreateState() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { collectionAddress: string; tokenAddresses: string[]; isPfp?: boolean }

  useEffect(() => {
    if (!state || !state.tokenAddresses.length) navigate(-1)
  }, [state, navigate])

  return state
}

export default useCreateState
