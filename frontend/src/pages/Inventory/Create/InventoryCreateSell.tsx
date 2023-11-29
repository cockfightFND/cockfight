import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { useDisclosure } from "@mantine/hooks"
import type { MantineTheme } from "@mantine/core"
import { Box, Drawer, Flex, Group, Stack, Switch, Text, UnstyledButton } from "@mantine/core"
import { modals } from "@mantine/modals"
import { DatePicker } from "@mantine/dates"
import { useMutation } from "@tanstack/react-query"
import BigNumber from "bignumber.js"
import { addDays, format, getDate, isEqual } from "date-fns"
import { MsgExecute } from "@initia/initia.proto/initia/move/v1/tx"
import { toAmount, truncate } from "@initia/utils"
import { bcs } from "@initia/query"
import getVectorSize from "../../../utils/getVectorSize"
import { INIT_METADATA, MARKETPLACE_MODULE_ADDRESS } from "../../../data/constants"
import { useAddress, useSignAndBroadcastTxSync } from "../../../data/account"
import { GLOBAL_PADDING } from "../../../styles/variables"
import Icon from "../../../styles/icons/Icon"
import WithCollectionInfo from "../../../components/WithCollectionInfo"
import BackButtonBar from "../../../components/BackButtonBar"
import FixedBottom from "../../../components/FixedBottom"
import SubmitButton from "../../../components/SubmitButton"
import StackedImages from "../../../components/StackedImages"
import ErrorModalContent from "../../../components/ErrorModalContent"
import TxSuccess from "../../../components/TxSuccess"
import UnitInput from "../../../components/UnitInput"
import { useHideNavigation } from "../../../app/hooks"
import useCreateState from "./useCreateState"

export interface FormValues {
  fixedPrice: string
  startPrice: string
  endDate: Date
}

const MAX_AUCTION_DURATION = 90
const CALENDER_DAY_CELL_SIZE = 34
const SWITCH_BUTTON_THUMB_SIZE = 20
const SWITCH_BUTTON_TRACK_PADDING = 1

const InventoryCreateSell = () => {
  useHideNavigation()
  const navigate = useNavigate()
  const { collectionAddress, tokenAddresses } = useCreateState()

  /* ui state */
  const [showAuction, setShowAuction] = useState(true)
  const [showCalender, { open, close }] = useDisclosure(false)
  const toggleShowAuction = () => setShowAuction(!showAuction)

  /* form */
  const now = useMemo(() => new Date(), [])
  const recommendedEndDates = new Map([
    [1, addDays(now, 1)],
    [3, addDays(now, 3)],
    [7, addDays(now, 7)],
  ])

  const { register, setValue, handleSubmit, watch } = useForm<FormValues>({
    defaultValues: { fixedPrice: "0", startPrice: "0", endDate: recommendedEndDates.values().next().value },
  })

  const { endDate } = watch()

  /* context */
  const address = useAddress()
  const signAndBroadcastTxSync = useSignAndBroadcastTxSync()

  /* submit */
  const { mutate, data, isLoading, reset } = useMutation({
    mutationFn: async ({ fixedPrice, startPrice, endDate }: FormValues) => {
      const endDateInSecond = Math.floor(endDate.getTime() / 1000)

      const messages = () => {
        const functionName = showAuction ? "batch_make_auction_order" : "batch_make_fixed_price_order"
        const args = showAuction
          ? [
              bcs.ser("vector<address>", tokenAddresses, { size: getVectorSize("address", tokenAddresses) }).toBytes(),
              bcs.ser("address", INIT_METADATA).toBytes(),
              bcs.ser("option<u64>", toAmount(fixedPrice, 6)).toBytes(),
              bcs.ser("u64", endDateInSecond).toBytes(),
              bcs.ser("u64", toAmount(startPrice, 6)).toBytes(),
            ]
          : [
              bcs.ser("vector<address>", tokenAddresses, { size: getVectorSize("address", tokenAddresses) }).toBytes(),
              bcs.ser("address", INIT_METADATA).toBytes(),
              bcs.ser("u64", toAmount(fixedPrice, 6)).toBytes(),
            ]

        return [
          {
            typeUrl: "/initia.move.v1.MsgExecute",
            value: MsgExecute.fromPartial({
              sender: address,
              moduleAddress: MARKETPLACE_MODULE_ADDRESS,
              moduleName: "marketplace_nft",
              functionName,
              typeArgs: [],
              args,
            }),
          },
        ]
      }

      const gasFee = BigNumber(3e5).times(tokenAddresses.length).toNumber() || 1e7

      return await signAndBroadcastTxSync(messages(), gasFee)
    },
    onError: (error) => {
      modals.open({
        title: "Something went wrong",
        children: <ErrorModalContent error={error} />,
        onClose: reset,
      })
    },
  })

  const onClose = () => navigate(`/inventory/game/${collectionAddress}`)
  const getDurationButtonStyle = ({ fn }: MantineTheme, date?: Date) => {
    const borderColor = date && isEqual(date, endDate) ? "mono.9" : "mono.1"
    return {
      background: "white",
      border: `2px solid ${fn.themeColor(borderColor)}`,
      borderRadius: 56 / 2,
      height: 56,
      textAlign: "center" as const,
    }
  }

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <BackButtonBar label="Sell" m={-GLOBAL_PADDING} mb={0} />

      <Stack spacing={10} pt={20} pb={40}>
        <WithCollectionInfo collectionAddress={collectionAddress}>
          {({ name, isPfp }) => (
            <>
              <StackedImages collectionAddress={collectionAddress} tokenAddresses={tokenAddresses} isPfp={isPfp} />
              <Stack spacing={4} ta="center">
                <Text c="mono.5" fz={12}>
                  {name}
                </Text>
                <Text fz={20}>{truncate(tokenAddresses[0])}</Text>
              </Stack>
            </>
          )}
        </WithCollectionInfo>
      </Stack>

      <UnitInput {...register("fixedPrice")} placeholder="0" label="Price" unit="INIT" />

      <Group position="apart" mt={40} pt={32} sx={({ fn }) => ({ borderTop: `2px dashed ${fn.themeColor("mono.2")}` })}>
        <Text fz={14} fw={700} c="mono.7">
          Auction
        </Text>
        <Switch
          color="black"
          checked={showAuction}
          onChange={() => toggleShowAuction()}
          thumbIcon={
            <Box c={showAuction ? "black" : "mono.4"}>
              <Icon.Check />
            </Box>
          }
          styles={{
            track: { minWidth: 20, width: 35, minHeight: 24 },
            thumb: { height: SWITCH_BUTTON_THUMB_SIZE, width: SWITCH_BUTTON_THUMB_SIZE, border: 0 },
            input: {
              ":checked+*>.mantine-Switch-thumb": {
                // click switch button animation
                left: `calc(100% - ${SWITCH_BUTTON_THUMB_SIZE}px - ${SWITCH_BUTTON_TRACK_PADDING}px)`,
              },
            },
          }}
        />
      </Group>

      {showAuction && (
        <Stack mt={28} spacing={28}>
          <UnitInput {...register("startPrice")} placeholder="0" label="Start bid price" unit="INIT" />

          <Stack>
            <Group position="apart">
              <Text>Duration</Text>
              <Text fz={12}>
                <Text c="mono.3" span>
                  Ends on
                </Text>{" "}
                <Text c="mono.5" span>
                  {endDate.toLocaleString()}
                </Text>
              </Text>
            </Group>

            <Group spacing={4} grow>
              {[...recommendedEndDates.entries()].map(([day, date]) => (
                <UnstyledButton
                  onClick={() => setValue("endDate", date)}
                  sx={(theme) => getDurationButtonStyle(theme, date)}
                  key={day}
                >
                  <Text c="mono.9" fw={800}>
                    {day}
                    <Text c="mono.5" fz={12} span>
                      {" "}
                      day{day > 1 && "s"}
                    </Text>
                  </Text>
                </UnstyledButton>
              ))}

              <UnstyledButton onClick={open} sx={(theme) => getDurationButtonStyle(theme)}>
                <Flex justify="center">
                  <Icon.More />
                </Flex>
              </UnstyledButton>
            </Group>
          </Stack>
        </Stack>
      )}

      <FixedBottom>
        <SubmitButton loading={isLoading}>Confirm</SubmitButton>
      </FixedBottom>

      {data && (
        <Drawer opened onClose={onClose}>
          <TxSuccess onClick={onClose}>
            {tokenAddresses.length}
            {tokenAddresses.length === 1 ? ` was ` : ` items were `}listed successfully!
          </TxSuccess>
        </Drawer>
      )}

      <Drawer opened={showCalender} onClose={close} size="90vh">
        <Flex direction="column" h="70vh" sx={{ overflowY: "auto" }}>
          <DatePicker
            minDate={addDays(now, 1)}
            maxDate={addDays(now, MAX_AUCTION_DURATION)}
            onChange={(date) => date && setValue("endDate", date)}
            numberOfColumns={4}
            renderDay={(date) => {
              const isToday = format(now, "MM-dd") === format(date, "MM-dd")
              if (!isToday) return null
              return (
                <Flex
                  align="center"
                  bg="mono.2"
                  justify="center"
                  w={CALENDER_DAY_CELL_SIZE}
                  h={CALENDER_DAY_CELL_SIZE}
                  sx={{ borderRadius: "50%" }}
                >
                  <Text c="mono.4">{getDate(date)}</Text>
                </Flex>
              )
            }}
            styles={({ fn }) => ({
              weekday: {
                color: fn.themeColor("mono.5"),
                textTransform: "uppercase",
                fontSize: 13,
                fontWeight: 600,
              },
              calendarHeaderLevel: {
                color: fn.themeColor("mono.9"),
                fontSize: 20,
                fontWeight: 600,
                justifyContent: "flex-start",
              },
              calendarHeaderControl: { display: "none" },
              month: { width: "100%", borderSpacing: 9, borderCollapse: "separate" },
              monthLevel: {
                marginBottom: 50,
              },
              monthLevelGroup: {
                flexDirection: "column",
              },
              monthCell: {
                textAlign: "center",
              },
              day: {
                borderRadius: "50%",
                width: CALENDER_DAY_CELL_SIZE,
                height: CALENDER_DAY_CELL_SIZE,
                fontSize: 20,
                fontWeight: 500,

                ":disabled": { color: fn.themeColor("mono.4") },
                "&[data-selected]": {
                  background: fn.themeColor("black"),
                  color: fn.themeColor("white"),

                  "&:active, &:hover": { background: fn.themeColor("black") },
                },

                "&[data-weekend]": {
                  color: fn.themeColor("black"),

                  "&[data-selected]": { color: fn.themeColor("white") },
                },
              },
            })}
          />
        </Flex>

        <FixedBottom>
          <Group grow>
            <SubmitButton invert onClick={close}>
              Cancel
            </SubmitButton>
            <SubmitButton onClick={close}>Apply</SubmitButton>
          </Group>
        </FixedBottom>
      </Drawer>
    </form>
  )
}

export default InventoryCreateSell
