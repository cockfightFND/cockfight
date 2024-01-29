export default function getError(error: any) {
  if (typeof error.response?.data === "string") return new Error(error.response.data)
  if (typeof error.response?.data?.message === "string") return new Error(error.response.data.message)
  if (typeof error.response?.status === "number")
    return new Error(getErrorMessageByStatus(error.response.status) ?? error.message)
  if (error instanceof Error) return error
  return new Error(String(error))
}

const getErrorMessageByStatus = (status?: number) => {
  switch (status) {
    case 400:
      return "Bad request"

    case 403:
      return "Forbidden"

    case 429:
      return "Too many requests"

    case 500:
    case 502:
    case 503:
      return "Internal server error"
  }
}
