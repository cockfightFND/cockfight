import { Fragment } from "react"
import { Flex, Group, Stack, Text } from "@mantine/core"
import { formatAmount } from "../../utils/format"
import type { HistoryData } from "@initia/marketplace-api-types/dist/common/history-data"
import actionToActivity from "../utils/actionToActivity"
import Icon from "../styles/icons/Icon"
import { formatDateRelative } from "../utils/formatDate"

interface Props {
  action: string
  timestamp: Date
  data: HistoryData
}

const ActivityItem = ({ action, timestamp, data }: Props) => {
  const { title, icon, addressList, amount } = actionToActivity(action, data)

  return (
    <Group position="apart">
      <Group spacing={10}>
        <Flex
          bg="white"
          w={34}
          h={34}
          sx={({ fn }) => ({
            justifyContent: "center",
            alignItems: "center",
            border: `2px solid ${fn.themeColor("mono.1")}`,
            borderRadius: "50%",
            svg: {
              width: 16,
              height: 16,
            },
          })}
        >
          {icon}
        </Flex>
        <Stack spacing={6}>
          <Text fz={14}>{title}</Text>
          {addressList && addressList.length > 0 && (
            <Flex
              gap={5}
              px={8}
              fz={12}
              align="center"
              c="mono.5"
              bg="mono.1"
              tt="uppercase"
              sx={({ fn }) => ({
                borderRadius: 3,
                svg: { color: fn.themeColor("mono.3") },
              })}
            >
              {addressList.map((address, index) =>
                index < 1 ? (
                  <Text key={index}>{address?.slice(-5)}</Text>
                ) : (
                  <Fragment key={index}>
                    <Icon.ArrowRight width={10} height={10} />
                    <Text>{address?.slice(-5)}</Text>
                  </Fragment>
                ),
              )}
            </Flex>
          )}
        </Stack>
      </Group>

      <Stack spacing={6} align="flex-end">
        <Group spacing={2} align="baseline">
          <Text fz={14} fw={600}>
            {amount ? formatAmount(amount) : "-"}
          </Text>
          {amount && (
            <Text fz={12} fw={600}>
              INIT
            </Text>
          )}
        </Group>
        <Text c="mono.5" fz={12} fw={600}>
          {formatDateRelative(timestamp)}
        </Text>
      </Stack>
    </Group>
  )
}

export default ActivityItem
