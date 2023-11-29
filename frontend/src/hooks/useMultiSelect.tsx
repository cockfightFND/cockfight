import { useState } from "react"
import { Group, Text, UnstyledButton } from "@mantine/core"
import Check from "../components/Check"

function useMultiSelect<T>(list: T[]) {
  const [selected, setSelected] = useState<T[]>([])
  const isAllSelected = selected.length === list.length
  const toggleSelectAll = () => setSelected(isAllSelected ? [] : list)
  const getIsSelected = (id: T) => selected.includes(id)
  const selectItem = (id: T) => {
    if (getIsSelected(id)) setSelected(selected.filter((s) => s !== id))
    else setSelected([...selected, id].sort((a, b) => list.indexOf(a) - list.indexOf(b)))
  }

  const selectItems = (ids: T[]) => {
    setSelected(ids)
  }

  const renderCheckAll = () => {
    return (
      <UnstyledButton fz={12} fw={700} onClick={toggleSelectAll}>
        <Group spacing={6}>
          <Check checked={isAllSelected} />
          <Text>
            {selected.length}
            <Text c="mono.5" span>
              /{list.length}
            </Text>
          </Text>
        </Group>
      </UnstyledButton>
    )
  }

  return { selected, isAllSelected, toggleSelectAll, getIsSelected, selectItem, selectItems, renderCheckAll }
}

export default useMultiSelect
