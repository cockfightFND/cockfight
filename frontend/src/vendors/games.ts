import { createContext } from "@initia/react-api"

type GameMetadata = {
  title: string
  api_url: string
  collection_address: string
  module_name: string
  module_address: string
}
type GameItemList = { name: string; type: string; tier: string; image: string }[]

const metadataAll = import.meta.glob("./*/metadata.json", { import: "default" })
const itemlistAll = import.meta.glob("./*/itemlist.json", { import: "default" })

export async function getGames() {
  const gamePromises = Object.keys(metadataAll).map(async (path) => {
    const metadata = (await metadataAll[path]()) as GameMetadata
    return [metadata.collection_address, metadata] as [string, GameMetadata]
  })

  const games = await Promise.all(gamePromises)
  return new Map(games)
}

export async function getGame(collectionAddress: string) {
  const games = await getGames()
  const game = games.get(collectionAddress)
  if (!game) throw new Error(`Game with collection_address ${collectionAddress} not found`)
  return game
}

export async function getGameItemNames(collectionAddress: string) {
  const names = Object.keys(itemlistAll).map(async (path) => {
    const itemList = (await itemlistAll[path]()) as GameItemList
    const gameMetadata = (await metadataAll[path.replace("itemlist.json", "metadata.json")]()) as GameMetadata

    if (gameMetadata.collection_address === collectionAddress) {
      return itemList.map((item) => item.name)
    }

    return null
  })

  const allItemNames = await Promise.all(names)
  const filteredItemNames = allItemNames.find((names) => names !== null)

  return filteredItemNames || []
}

/* react */
export const [useGames, GamesProvider] = createContext<Awaited<ReturnType<typeof getGames>>>("Games")
export function useGame(collectionAddress: string) {
  const games = useGames()
  const game = games.get(collectionAddress)
  if (!game) throw new Error(`Game with collection_address ${collectionAddress} not found`)
  return game
}