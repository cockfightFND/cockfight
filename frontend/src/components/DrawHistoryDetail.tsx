import { forwardRef } from "react"
import type { BoxProps } from "@mantine/core"
import { Flex, Group, Stack, Text, Image, Box, Drawer, createPolymorphicComponent } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import type { DrawCount, TicketResponse } from "@initia/marketplace-api-types"
import Icon from "../styles/icons/Icon"
import { useIsDrawMenu } from "../styles/colorScheme"
import { formatDateRelative } from "../utils/formatDate"
import DrawHistoryItemList from "./DrawHistoryItemList"

interface Props extends BoxProps {
  tickets: TicketResponse[]
  timestamp?: Date
  updateAt?: Date
  prizeCount?: DrawCount
  isPfp?: boolean
}

const _DrawHistoryDetail = forwardRef<HTMLDivElement, Props>(
  ({ tickets, timestamp, updateAt, prizeCount, isPfp, ...others }, ref) => {
    const isDrawMenu = useIsDrawMenu()
    const [opened, { open, close }] = useDisclosure()

    const drawerColor = isDrawMenu ? "mono.9" : "mono.0"

    const successTickets = tickets.filter((t) => !!t.result)

    return (
      <Box ref={ref} {...others}>
        <Group position="apart">
          <Group spacing={18} miw={0} noWrap onClick={successTickets.length > 0 ? open : () => {}}>
            {successTickets.length > 0 ? (
              <Box sx={{ position: "relative" }}>
                <Image
                  bg={successTickets[0]?.result?.token.backgroundColor}
                  src={successTickets[0]?.result?.token.imageUrl + "/public"}
                  width={40}
                  height={40}
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    ".mantine-Image-imageWrapper": isPfp ? { img: { padding: 0 } } : undefined,
                  }}
                />
                <Flex
                  sx={({ fn }) => ({
                    alignItems: "center",
                    border: isDrawMenu ? 0 : `1px solid ${fn.themeColor("mono.2")}`,
                    background: isDrawMenu ? fn.themeColor("mono.7") : "white",
                    borderRadius: 10,
                    boxShadow: "0px 3px 8px 0px rgba(0, 0, 0, 0.10)",
                    color: isDrawMenu ? fn.themeColor("mono.5") : "black",
                    gap: 1,
                    left: "50%",
                    position: "absolute",
                    paddingLeft: 5,
                    paddingRight: 7,
                    transform: "translate(-50%, -50%)",
                    whiteSpace: "nowrap",
                  })}
                >
                  <Text c={isDrawMenu ? "mono.2" : "black"} fz={11}>
                    {successTickets.length}
                  </Text>
                  <Icon.Right width={6} height={6} />
                </Flex>
              </Box>
            ) : (
              <Flex
                sx={({ fn }) => ({
                  justifyContent: "center",
                  alignItems: "center",
                  width: 40,
                  height: 40,
                  borderRadius: 4,
                  backgroundColor: fn.themeColor("mono.1"),
                })}
              >
                <Icon.NoLuck />
              </Flex>
            )}
            <Stack spacing={4}>
              <Text fz={14} fw={600}>
                <Text span tt="uppercase">
                  Draw
                </Text>{" "}
                {tickets.length}x and got {successTickets.length > 0 ? successTickets.length : "no"} items
              </Text>

              {updateAt && (
                <Text fz={11} fw={600} c="mono.5">
                  {new Date(updateAt).toLocaleString()}
                </Text>
              )}
            </Stack>
          </Group>

          {timestamp && (
            <Text c="mono.5" fz={11} fw={500}>
              {formatDateRelative(timestamp)}
            </Text>
          )}
        </Group>

        {successTickets.length > 0 && (
          <Drawer
            opened={opened}
            onClose={close}
            sx={({ fn }) => ({
              ".mantine-Drawer-header": { background: fn.themeColor(drawerColor) },
              ".mantine-Drawer-content": {
                background: fn.themeColor(drawerColor),
                color: isDrawMenu ? fn.themeColor("mono.2") : "black",
              },
            })}
          >
            <Stack spacing={20}>
              <Stack spacing={7}>
                <Group position="apart">
                  <Text fz={11} fw={600} c={isDrawMenu ? "mono.3" : "mono.5"} tt="uppercase">
                    Id {successTickets[0].poolId}
                  </Text>
                  {updateAt && (
                    <Text fz={11} fw={600} c={isDrawMenu ? "mono.3" : "mono.5"}>
                      {formatDateRelative(updateAt)}
                    </Text>
                  )}
                  {timestamp && (
                    <Text fz={11} fw={600} c={isDrawMenu ? "mono.3" : "mono.5"}>
                      {formatDateRelative(timestamp)}
                    </Text>
                  )}
                </Group>
                <Text fz={14} fw={600}>
                  <Text span tt="uppercase">
                    Draw
                  </Text>{" "}
                  {tickets.length}x{" "}
                  <Text span c="mono.5">
                    and got
                  </Text>{" "}
                  {successTickets.length > 0 ? successTickets.length : "no"}{" "}
                  <Text span c="mono.5">
                    items
                  </Text>
                </Text>
              </Stack>
              {isDrawMenu ? (
                <DrawHistoryItemList totalItems={successTickets} prizeCount={prizeCount} isPfp={isPfp} />
              ) : (
                <DrawHistoryItemList totalItems={successTickets} isPfp={isPfp} />
              )}
            </Stack>
          </Drawer>
        )}
      </Box>
    )
  },
)

const DrawHistoryDetail = createPolymorphicComponent<"div", Props>(_DrawHistoryDetail)

export default DrawHistoryDetail
