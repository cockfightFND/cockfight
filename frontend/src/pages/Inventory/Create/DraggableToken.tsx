import { forwardRef } from "react"
import type { DraggableProvidedDragHandleProps } from "react-beautiful-dnd"
import type { BoxProps } from "@mantine/core"
import { UnstyledButton } from "@mantine/core"
import { Box, Group, Image, Text, createPolymorphicComponent } from "@mantine/core"
import { truncate } from "@initia/utils"
import WithTokenDetails from "../../../components/WithTokenDetails"

interface Props extends BoxProps {
  collectionAddress: string
  tokenAddress: string
  order: number
  onDelete: () => void
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
  isDragging: boolean
  isDraggingOver: boolean
  isPfp?: boolean
}

const _DraggableToken = forwardRef<HTMLDivElement, Props>(
  (
    { collectionAddress, tokenAddress, order, onDelete, dragHandleProps, isDragging, isDraggingOver, ...others },
    ref,
  ) => {
    return (
      <Group
        position="apart"
        bg="white"
        mb={8}
        p={12}
        noWrap
        sx={({ fn }) => ({
          border: `1px solid ${fn.themeColor("mono.1")}`,
          boxShadow: isDragging ? "0px 10px 15px 0px rgba(0, 0, 0, 0.10)" : undefined,
          opacity: isDraggingOver && !isDragging ? 0.5 : undefined,
          userSelect: "none",
        })}
        ref={ref}
        {...others}
      >
        <WithTokenDetails collectionAddress={collectionAddress} tokenAddress={tokenAddress}>
          {({ imageUrl, backgroundColor }) => (
            <>
              <Group spacing={6} noWrap>
                <Box miw={16} fz={12} ta="center">
                  {order}
                </Box>

                <Group spacing={12} noWrap>
                  <Image
                    bg={backgroundColor}
                    src={imageUrl + "/public"}
                    sx={{
                      borderRadius: 4,
                      overflow: "hidden",
                      ".mantine-Image-imageWrapper": others?.isPfp ? { img: { padding: 0 } } : undefined,
                    }}
                    width={48}
                    height={48}
                  />
                  <Text fz={14}>{truncate(tokenAddress)}</Text>
                </Group>
              </Group>

              <Group noWrap>
                <UnstyledButton c="red" fw="bold" onClick={onDelete}>
                  Delete
                </UnstyledButton>
                <Box {...dragHandleProps}>Drag</Box>
              </Group>
            </>
          )}
        </WithTokenDetails>
      </Group>
    )
  },
)

const DraggableToken = createPolymorphicComponent<"div", Props>(_DraggableToken)

export default DraggableToken
