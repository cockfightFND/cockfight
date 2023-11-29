import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRecoilState } from "recoil"
import { useDebouncedValue } from "@mantine/hooks"
import SearchBar from "../../../components/SearchBar"
import { inventoryFilterState } from "./inventory-filter"

const InventoryGameDetailsSearch = () => {
  const [filter, setFilter] = useRecoilState(inventoryFilterState)
  const { register, watch } = useForm({ values: filter })
  const query = watch("query")
  const [debouncedQuery] = useDebouncedValue(query, 200)

  useEffect(() => {
    setFilter((prev) => ({ ...prev, query: debouncedQuery }))
  }, [debouncedQuery, setFilter])

  return <SearchBar {...register("query")} placeholder="Search by item name and token id" />
}

export default InventoryGameDetailsSearch
