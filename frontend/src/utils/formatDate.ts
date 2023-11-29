import { intlFormatDistance } from "date-fns"

export const formatDateRelative = (date: string | Date) => {
  return intlFormatDistance(new Date(date), new Date())
}
