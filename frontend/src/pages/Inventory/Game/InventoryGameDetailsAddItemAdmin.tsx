import { useCallback, useEffect, useState } from "react"
import { Button } from "@mantine/core"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import getId from "../../../utils/getId"
import { getGame, getGameItemNames } from "../../../vendors/games"
import { useAddress } from "../../../data/account"
import useCollectionAddress from "../../../hooks/useCollectionAddress"

const getRandomName = (names: string[]) => {
  const randomIndex = Math.floor(Math.random() * names.length)
  return names[randomIndex]
}

const InventoryGameDetailsAddItemAdmin = ({ currentItemsLength }: { currentItemsLength: number }) => {
  const collectionAddress = useCollectionAddress()

  const address = useAddress()
  const queryClient = useQueryClient()

  const addItemFn = useCallback(async () => {
    const { api_url, module_name } = await getGame(collectionAddress)
    const names = await getGameItemNames(collectionAddress)
    await axios.post(
      "/admin/add_item",
      {
        module_name,
        item_id: getId(),
        name: getRandomName(names),
        owner: address,
        extend_attributes: [],
      },
      { baseURL: api_url },
    )
  }, [address, collectionAddress])

  const addItem = useMutation({
    mutationFn: addItemFn,
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })

  const [hasBulkAdded, setHasBulkAdded] = useState(false)
  const addItems = useMutation({
    mutationFn: async (length: number) => {
      await Promise.all(Array.from({ length }).map(() => addItemFn()))
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries()
    },
  })

  useEffect(() => {
    if (currentItemsLength >= 10) return
    if (hasBulkAdded) return
    addItems.mutate(10 - currentItemsLength)
    setHasBulkAdded(true)
  }, [currentItemsLength, addItems, hasBulkAdded])

  return (
    <Button
      variant="outline"
      color="green"
      size="xs"
      onClick={() => addItem.mutate()}
      loading={addItem.isLoading || addItems.isLoading}
    >
      + Add a random item
    </Button>
  )
}

export default InventoryGameDetailsAddItemAdmin
