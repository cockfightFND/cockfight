import { useState } from "react"
import { Flex, UnstyledButton } from "@mantine/core"
import Icon from "../styles/icons/Icon"

function useViewMode(defaultValue: "grid" | "list") {
  const [viewMode, setViewMode] = useState(defaultValue)
  const toggleViewMode = () => setViewMode(viewMode === "grid" ? "list" : "grid")
  const renderViewMode = () => (
    <UnstyledButton
      bg="white"
      w={32}
      h={32}
      onClick={toggleViewMode}
      sx={({ fn }) => ({ border: `1px solid ${fn.themeColor("mono.1")}`, borderRadius: 8 })}
    >
      <Flex justify="center" align="center">
        {viewMode === "grid" ? <Icon.ListView /> : <Icon.GridView />}
      </Flex>
    </UnstyledButton>
  )

  const isGridView = viewMode === "grid"
  const isListView = viewMode === "list"

  return { viewMode, isGridView, isListView, renderViewMode }
}

export default useViewMode
