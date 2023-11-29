import type { ReactNode } from "react"
import { Box, Flex, Collapse, Image, Stack, Text } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import Icon from "../../../styles/icons/Icon"

interface Props {
  image: string
  backgroundColor?: string
  meta?: string | null
  title: string | null
  footer?: ReactNode
  isPfp?: boolean
  renderDetail?: () => ReactNode
  renderCollapsed?: () => ReactNode
}

const MyIndexItem = ({ image, backgroundColor, meta, title, footer, isPfp, renderDetail, renderCollapsed }: Props) => {
  const [isCollapseOpened, { toggle }] = useDisclosure(false)

  return (
    <Box
      bg="white"
      sx={({ fn }) => ({
        outline: isCollapseOpened ? `2px solid ${fn.themeColor("black")}` : `1px solid ${fn.themeColor("mono.1")}`,
        borderRadius: 12,
        overflow: "hidden",
      })}
    >
      <Flex wrap="nowrap" onClick={toggle}>
        <Image
          bg={backgroundColor}
          src={image}
          width={100}
          height={100}
          sx={{
            ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
          }}
        />
        <Flex wrap="nowrap" justify="space-between" sx={{ flex: 1 }}>
          <Stack spacing={4} p={16} pl={12} miw={0}>
            <Text c="mono.5" fz={11} fw={600}>
              {meta}
            </Text>
            <Text fz={18} truncate>
              {title}
            </Text>
            {renderDetail && (
              <Box fz={12} pt={6} c="mono.7">
                {renderDetail()}
              </Box>
            )}
          </Stack>
          {renderCollapsed && (
            <Flex c="mono.5" align="center" pr={16}>
              <Icon.ChevronDown />
            </Flex>
          )}
        </Flex>
      </Flex>
      {renderCollapsed && (
        <Collapse in={isCollapseOpened}>
          <Box p={16} sx={({ fn }) => ({ borderTop: `1px solid ${fn.themeColor("mono.1")}` })}>
            {renderCollapsed()}
          </Box>
        </Collapse>
      )}
    </Box>
  )
}

export default MyIndexItem
