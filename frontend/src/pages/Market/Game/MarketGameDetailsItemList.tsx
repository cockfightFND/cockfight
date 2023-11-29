import { useMemo } from "react"
import { useRecoilValue } from "recoil"
import { Link } from "react-router-dom"
import { useDisclosure } from "@mantine/hooks"
import { Box, Drawer, Flex, Group, Image, SimpleGrid, Slider, Text, UnstyledButton } from "@mantine/core"
import { modals } from "@mantine/modals"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { formatAmount, truncate } from "@initia/utils"
import { bcs } from "@initia/query"
import type { TokenDetailResponse } from "@initia/marketplace-api-types"
import getVectorSize from "../../../utils/getVectorSize"
import { useAddress, useBalance, useSignAndBroadcastTxSync } from "../../../data/account"
import { MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import useViewMode from "../../../hooks/useViewMode"
import useMultiSelect from "../../../hooks/useMultiSelect"
import { SUBMIT_MARGIN } from "../../../styles/variables"
import Icon from "../../../styles/icons/Icon"
import FixedBottom from "../../../components/FixedBottom"
import StackedImages from "../../../components/StackedImages"
import SubmitButton from "../../../components/SubmitButton"
import ErrorModalContent from "../../../components/ErrorModalContent"
import AspectImage from "../../../components/AspectImage"
import Check from "../../../components/Check"
import TxSuccess from "../../../components/TxSuccess"
import { navigationBarHeightState } from "../../../app/hooks"
import WithCollectionInfo from "../../../components/WithCollectionInfo"

function checkAreConsecutiveFromZero(arr: number[]) {
  if (arr.length === 0 || arr[0] !== 0) return false
  const sortedArr = [...arr].sort((a, b) => a - b)
  return sortedArr.every((num, index) => num === index)
}

const MarketGameDetailsItemList = ({ list }: { list: TokenDetailResponse[] }) => {
  const navigationHeight = useRecoilValue(navigationBarHeightState)
  const collectionAddress = useCollectionAddress()

  /* form */
  const orderableList = useMemo(() => list.filter(({ orders }) => !!orders).map((_, i) => i), [list])
  const { getIsSelected, selectItem, selectItems, selected, renderCheckAll } = useMultiSelect(orderableList)
  const selectedTokenAddresses = selected.map((index) => list[index].tokenAddress)
  const selectedOrderIds = selected
    .map((index) => list[index].orders?.[0].orderId)
    .filter((orderId): orderId is number => orderId !== undefined)

  const selectedTotalPrice = BigNumber.sum(...selected.map((index) => list[index].orders?.[0].fixedPrice?.amount ?? 0))

  /* context */
  const address = useAddress()
  const balance = useBalance()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()
  const queryClient = useQueryClient()

  /* submit */
  const { mutate, data, isLoading, reset } = useMutation({
    mutationFn: async () => {
      if (!address) throw new Error("Wallet not connected")
      if (BigNumber(selectedTotalPrice).gt(balance)) throw new Error("Insufficient balance")

      const messages = [
        {
          typeUrl: "/initia.move.v1.MsgExecute",
          value: MsgExecute.fromPartial({
            sender: address,
            moduleAddress: MARKETPLACE_MODULE_ADDRESS,
            moduleName: "marketplace_nft",
            functionName: "sweep",
            typeArgs: [],
            args: [
              bcs.ser("vector<u64>", selectedOrderIds, { size: getVectorSize("u64", selectedOrderIds) }).toBytes(),
              bcs.ser("u64", selectedOrderIds.length).toBytes(),
              bcs.ser("u64", selectedOrderIds.length).toBytes(),
            ],
          }),
        },
      ]

      const gasFee = BigNumber(45e4).times(selectedOrderIds.length).plus(2e5).toNumber() || 1e7

      return await signAndBroadcastTxSync(messages, gasFee)
    },
    onSuccess: async () => {},
    onError: (error) => {
      modals.open({
        title: "Something went wrong",
        children: <ErrorModalContent error={error} />,
        onClose: reset,
      })
    },
  })

  /* render: ui state */
  const { isGridView, renderViewMode } = useViewMode("grid")
  const [opened, { open, close }] = useDisclosure()
  const areConsecutive = !selected.length || checkAreConsecutiveFromZero(selected)

  const closeDrawer = async () => {
    if (data) {
      await queryClient.invalidateQueries()
      selectItems([])
      close()
      reset()
    } else {
      close()
    }
  }

  /* render */
  const renderSweep = (isPfp: boolean) => {
    if (data) {
      return (
        <TxSuccess onClick={closeDrawer}>
          Bought {selected.length} items with {formatAmount(selectedTotalPrice)} INIT
        </TxSuccess>
      )
    }

    return (
      <>
        <Box py={16}>
          <StackedImages collectionAddress={collectionAddress} tokenAddresses={selectedTokenAddresses} isPfp={isPfp} />
        </Box>

        <SubmitButton onClick={() => mutate()} loading={isLoading} mt={SUBMIT_MARGIN}>
          Confirm
        </SubmitButton>
      </>
    )
  }

  if (!list.length)
    return (
      <Flex mt={24} justify="center">
        <Text c="mono.5" fz={14}>
          No listed items
        </Text>
      </Flex>
    )

  return (
    <WithCollectionInfo collectionAddress={collectionAddress}>
      {({ isPfp }) => (
        <Box pt={20}>
          <Group position="apart">
            {renderCheckAll()}
            {renderViewMode()}
          </Group>

          <SimpleGrid cols={isGridView ? 2 : 1} pt={12} spacing={8} verticalSpacing={isGridView ? 20 : 8}>
            {list.map(({ tokenAddress, imageUrl, name, orders, backgroundColor }, index) => {
              const fixedPrice = orders?.[0].fixedPrice

              return (
                <Box
                  bg="white"
                  sx={({ fn }) => ({
                    border: `1px solid ${fn.themeColor("mono.1")}`,
                    borderRadius: 12,
                    outline: getIsSelected(index) ? `2px solid ${fn.themeColor("mono.9")}` : undefined,
                    outlineOffset: -2,
                    overflow: "hidden",
                  })}
                  pos="relative"
                  key={tokenAddress}
                >
                  <UnstyledButton component={Link} to={`./item/${encodeURIComponent(tokenAddress)}`}>
                    <UnstyledButton
                      onClick={(e) => {
                        e.preventDefault()
                        selectItem(index)
                      }}
                      p={isGridView ? 8 : 4}
                      pos="absolute"
                      top={0}
                      left={0}
                      sx={{
                        display: fixedPrice ? "block" : "none",
                        zIndex: 1,
                      }}
                    >
                      <Check checked={getIsSelected(index)} />
                    </UnstyledButton>

                    {isGridView ? (
                      <>
                        <AspectImage bg={backgroundColor} src={imageUrl + "/public"} isPfp={isPfp} />

                        <Box px={12} pt={14} pb={20}>
                          <Text>{name ?? truncate(tokenAddress)}</Text>

                          {fixedPrice && (
                            <Text fz={14} fw={500}>
                              {formatAmount(fixedPrice.amount)}{" "}
                              <Text fz={11} span>
                                INIT
                              </Text>
                            </Text>
                          )}
                        </Box>
                      </>
                    ) : (
                      <Group spacing={16}>
                        <Image bg={backgroundColor} src={imageUrl + "/public"} width={64} height={64} />
                        <Text>{name ?? truncate(tokenAddress)}</Text>
                      </Group>
                    )}
                  </UnstyledButton>
                </Box>
              )
            })}
          </SimpleGrid>

          <FixedBottom bottom={navigationHeight}>
            <Box pos="relative">
              {selected.length > 0 && (
                <UnstyledButton
                  onClick={open}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    background: "black",
                    borderRadius: 26,
                    color: "white",
                    fontSize: 16,
                    fontWeight: 800,
                    padding: "12px 24px",
                    position: "absolute",
                    bottom: 0,
                    height: 96,
                    width: "100%",
                    zIndex: -1,
                  }}
                >
                  {areConsecutive ? <Text>Buy</Text> : <Text>Buy {selected.length} items</Text>}
                  <Flex align="center" gap={4}>
                    <Text>{formatAmount(selectedTotalPrice)}</Text>
                    <Flex align="center" gap={2} c="mono.5">
                      <Text>INIT</Text>
                      <Icon.ChevronRight />
                    </Flex>
                  </Flex>
                </UnstyledButton>
              )}

              <Flex
                align="center"
                bg="white"
                px={28}
                sx={{ border: "2px solid black", borderRadius: 52 / 2, height: 52 }}
              >
                <Text c={areConsecutive ? "black" : "mono.6"} miw={28}>
                  {areConsecutive ? selected.length : "0"}
                </Text>

                <Box sx={{ flex: 1 }}>
                  <Slider
                    value={areConsecutive ? selected.length : 0}
                    onChange={(value) => selectItems(list.slice(0, value).map((_, index) => index))}
                    max={orderableList.length}
                    size={2}
                    thumbSize={16}
                    styles={({ fn }) => ({
                      thumb: {
                        background: areConsecutive ? "black" : fn.themeColor("mono.6"),
                        borderColor: areConsecutive ? "black" : fn.themeColor("mono.6"),
                      },
                    })}
                  />
                </Box>
              </Flex>
            </Box>
          </FixedBottom>

          <Drawer opened={opened} onClose={closeDrawer} title="Buy">
            {renderSweep(isPfp)}
          </Drawer>
        </Box>
      )}
    </WithCollectionInfo>
  )
}

export default MarketGameDetailsItemList
