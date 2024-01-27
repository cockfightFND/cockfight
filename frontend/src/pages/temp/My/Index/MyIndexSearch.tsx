import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useRecoilState } from "recoil"
import { Input, UnstyledButton } from "@mantine/core"
import { useDebouncedValue } from "@mantine/hooks"
import Icon from "../../../styles/icons/Icon"
import { myFilterState } from "./my-filter"

const MyIndexSearch = () => {
  const [filter, setFilter] = useRecoilState(myFilterState)
  const { query: queryGlobal, isOpen } = filter

  const { register, watch, setValue } = useForm({ defaultValues: { query: queryGlobal } })
  const { query } = watch()
  const [debouncedQuery] = useDebouncedValue(query, 200)

  useEffect(() => {
    setFilter((prev) => ({ ...prev, query: debouncedQuery }))
  }, [debouncedQuery, setFilter])

  return !isOpen ? (
    <UnstyledButton
      onClick={() => setFilter((prev) => ({ ...prev, isOpen: true }))}
      sx={{
        position: "absolute",
        right: 20,
        top: 28,
      }}
    >
      <Icon.Search width={16} height={16} />
    </UnstyledButton>
  ) : (
    <Input
      {...register("query")}
      placeholder="Search by item keyword"
      autoComplete="off"
      icon={<Icon.Search width={16} height={16} />}
      rightSection={
        <UnstyledButton
          c="mono.5"
          onClick={() => {
            setValue("query", "")
            setFilter((prev) => ({ ...prev, isOpen: false }))
          }}
        >
          <Icon.CancelFilled width={16} height={16} />
        </UnstyledButton>
      }
      styles={({ fn }) => ({
        wrapper: {
          flex: 1,
        },
        icon: {
          color: fn.themeColor("mono.9"),
        },
        input: {
          height: 46,
          fontWeight: 700,
          border: "none",
          borderRadius: 12,
          outline: `1px solid ${fn.themeColor("mono.1")}`,
          "&:active, &:focus": {
            borderColor: fn.themeColor("mono.9"),
            outline: `2px solid ${fn.themeColor("mono.9")}`,
          },
          "::placeholder": {
            color: fn.themeColor("mono.3"),
          },
        },
      })}
    />
  )
}

export default MyIndexSearch
