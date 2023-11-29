import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRecoilState } from "recoil"
import { useDebouncedValue } from "@mantine/hooks"
import SearchBar from "../../../components/SearchBar"
import { drawFilterState } from "./draw-filter"
import DrawGameDetailsFilter from "./DrawGameDetailsFilter"

const DrawGameDetailsSearch = () => {
  const [filter, setFilter] = useRecoilState(drawFilterState)
  const { register, watch } = useForm({ defaultValues: filter })
  const query = watch("query")
  const [debouncedQuery] = useDebouncedValue(query, 200)

  useEffect(() => {
    setFilter((prev) => ({ ...prev, query: debouncedQuery }))
  }, [debouncedQuery, setFilter])

  return <SearchBar {...register("query")} renderModalContent={(close) => <DrawGameDetailsFilter onClose={close} />} />
}

export default DrawGameDetailsSearch
