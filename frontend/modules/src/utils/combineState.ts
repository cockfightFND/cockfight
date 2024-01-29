import type { UseQueryResult } from "@tanstack/react-query"

const combineState = (...results: Partial<UseQueryResult>[]) => ({
  isLoading: results.some((result) => result.isLoading),
  isFetching: results.some((result) => result.isFetching),
  isSuccess: results.every((result) => result.isSuccess),
  error: results.find((result) => result.error)?.error,
  refetch: results.map((result) => result.refetch),
})

export default combineState
