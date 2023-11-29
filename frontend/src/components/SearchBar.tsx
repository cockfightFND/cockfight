import type { ReactNode } from "react"
import { forwardRef } from "react"
import type { InputProps } from "@mantine/core"
import { Input, Modal, Text, UnstyledButton, createPolymorphicComponent } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { GLOBAL_PADDING } from "../styles/variables"
import Icon from "../styles/icons/Icon"
import { useIsDrawMenu } from "../styles/colorScheme"

interface Props extends InputProps {
  renderModalContent?: (close: () => void) => ReactNode
}

const _SearchBar = forwardRef<HTMLInputElement, Props>(({ renderModalContent, ...others }, ref) => {
  const [opened, { open, close }] = useDisclosure()
  const isDrawMenu = useIsDrawMenu()

  const borderColor = isDrawMenu ? "mono.9" : "mono.1"
  const iconColor = isDrawMenu ? "mono.4" : "mono.9"
  const backgroundColor = isDrawMenu ? "mono.9" : "mono.0"

  return (
    <>
      <Input
        placeholder="Search by title, item name and token id"
        radius={0}
        icon={
          <Text display="flex" c={iconColor}>
            <Icon.Search />
          </Text>
        }
        iconWidth={16 + 2 * GLOBAL_PADDING}
        rightSection={
          renderModalContent && (
            <UnstyledButton display="flex" c={iconColor} onClick={open}>
              <Icon.Filter />
            </UnstyledButton>
          )
        }
        rightSectionWidth={16 + 2 * GLOBAL_PADDING}
        mx={-GLOBAL_PADDING}
        styles={({ fn }) => ({
          input: {
            background: isDrawMenu ? "black" : "white",
            color: isDrawMenu ? fn.themeColor("mono.1") : "black",
            height: 56,
            border: 0,
            borderTop: `2px solid ${fn.themeColor(borderColor)}`,
            borderBottom: `2px solid ${fn.themeColor(borderColor)}`,
            fontSize: 14,
            fontWeight: 700,

            "&:focus, &:focus-within": {
              borderColor: fn.themeColor(borderColor),
            },
          },
        })}
        ref={ref}
        {...others}
      />

      {renderModalContent && (
        <Modal
          opened={opened}
          onClose={close}
          title="Filter"
          fullScreen
          sx={({ fn }) => ({
            ".mantine-Modal-content": {
              background: fn.themeColor(backgroundColor),
            },
            ".mantine-Modal-header": {
              background: fn.themeColor(backgroundColor),
              color: isDrawMenu ? fn.themeColor("mono.1") : "black",
            },
            ".mantine-Modal-title": {
              fontSize: 16,
              fontWeight: 700,
            },
          })}
        >
          {renderModalContent(close)}
        </Modal>
      )}
    </>
  )
})

const SearchBar = createPolymorphicComponent<"input", Props>(_SearchBar)

export default SearchBar
