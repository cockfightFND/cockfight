import { Stack, SimpleGrid, Flex, Text, Button, Drawer } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import type { PoolResponse } from "@initia/marketplace-api-types"
import { DrawStatus } from "@initia/marketplace-api-types"
import Container from "../../../components/Container"
import Icon from "../../../styles/icons/Icon"
import MyIndexDrawItemEnd from "./MyIndexDrawItemEnd"

interface Props {
  type: DrawStatus
  pool: PoolResponse
}

const MyIndexDrawTabContentCollapsed = ({ type, pool }: Props) => {
  const { totalCount, prizeCount, updateAt } = pool
  if (!totalCount || !prizeCount) throw new Error("Something went wrong")

  const [isOpened, { open, close }] = useDisclosure(false)

  return (
    <Stack spacing={16} fw={600}>
      <SimpleGrid cols={2} spacing={2} sx={{ alignItems: "end" }}>
        <Stack spacing={2}>
          <Text c="mono.3" fz={12}>
            Remaining
          </Text>
          <Flex align="baseline" gap={2} c="mono.7">
            <Text fz={16}>{prizeCount.remain}</Text>
            <Text fz={12}>
              /{prizeCount.total}{" "}
              <Text c="mono.4" span>
                Prize
              </Text>
            </Text>
          </Flex>
        </Stack>
        <Flex align="baseline" gap={2}>
          <Text fz={16}>{totalCount.remain - prizeCount.remain}</Text>
          <Text fz={12}>
            /{totalCount.total - prizeCount.total}{" "}
            <Text c="mono.4" span>
              Low tier
            </Text>
          </Text>
        </Flex>
      </SimpleGrid>
      <Stack spacing={10}>
        <Flex c="mono.5" gap={4}>
          <Icon.Time />
          <Text fz={11} fw={600} sx={{ "&:first-letter": { textTransform: "capitalize" } }}>
            {type} on {new Date(updateAt).toLocaleString()}
          </Text>
        </Flex>
        {type === DrawStatus.Open && (
          <Button color="mono.0" c="mono.9" fz={12} fw={700} onClick={open}>
            End Draw
          </Button>
        )}
      </Stack>

      <Drawer opened={isOpened} onClose={close} title="End Draw">
        <Container>
          <MyIndexDrawItemEnd {...pool.mainComponent.token} name={pool.name} poolId={pool.poolId} onFinish={close} />
        </Container>
      </Drawer>
    </Stack>
  )
}

export default MyIndexDrawTabContentCollapsed
