import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRecoilState } from "recoil"
import { useDebouncedValue } from "@mantine/hooks"
import SearchBar from "../../../components/SearchBar"
import { marketFilterState } from "./market-filter"
import MarketGameDetailsFilter from "./MarketGameDetailsFilter"

const MarketGameDetailsSearch = () => {
  const [filter, setFilter] = useRecoilState(marketFilterState)
  const { register, watch } = useForm({ defaultValues: filter })
  const query = watch("query")
  const [debouncedQuery] = useDebouncedValue(query, 200)

  useEffect(() => {
    setFilter((prev) => ({ ...prev, query: debouncedQuery }))
  }, [debouncedQuery, setFilter])

  return (
    <SearchBar {...register("query")} renderModalContent={(close) => <MarketGameDetailsFilter onClose={close} />} />
  )
}

export default MarketGameDetailsSearch
