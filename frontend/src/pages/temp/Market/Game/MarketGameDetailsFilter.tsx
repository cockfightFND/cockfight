import { useState } from "react"
import { useRecoilState, useResetRecoilState } from "recoil"
import { useForm } from "react-hook-form"
import { evolve } from "ramda"
import type { CheckboxProps } from "@mantine/core"
import { Accordion, Box, Checkbox, Divider, Flex } from "@mantine/core"
import { Group, Input, Radio, Stack, Text, UnstyledButton, useMantineTheme } from "@mantine/core"
import { formatAmount, toAmount } from "@initia/utils"
import { TokenStatus } from "@initia/marketplace-api-types"
import toSentenceCase from "../../../utils/toSentenceCase"
import SubmitButton from "../../../components/SubmitButton"
import FixedBottom from "../../../components/FixedBottom"
import UnitInput from "../../../components/UnitInput"
import RadioButton from "../../../components/RadioButton"
import useCollectionAddress from "../../../hooks/useCollectionAddress"
import Icon from "../../../styles/icons/Icon"
import { useAPI } from "../../../data/api"
import { marketFilterState, defaultValue } from "./market-filter"

const CheckboxIcon: CheckboxProps["icon"] = (props) => <Icon.Select {...props} />

const toFieldValues = evolve({
  price: {
    min: (value: string) => (value ? formatAmount(value, { comma: false }) : ""),
    max: (value: string) => (value ? formatAmount(value, { comma: false }) : ""),
  },

  traits: {
    stringTraits: (data?: { traitType: string; value: string[] }[]) => data?.filter(({ value }) => !!value.length),
  },
})

const fromFieldValues = evolve({
  price: {
    min: (value: string) => (value ? toAmount(value) : undefined),
    max: (value: string) => (value ? toAmount(value) : undefined),
  },

  traits: {
    stringTraits: (data?: { traitType: string; value: string[] }[]) => data?.filter(({ value }) => !!value.length),
  },
})

const getTokenStatusLabel = (status: TokenStatus) => {
  switch (status) {
    case TokenStatus.Open:
      return "On sale"
    case TokenStatus.OnAuction:
      return "Auction"
    case TokenStatus.All:
      return "All collection items"
    default:
      return toSentenceCase(status)
  }
}

const MarketGameDetailsFilter = ({ onClose }: { onClose: () => void }) => {
  const [filter, setFilter] = useRecoilState(marketFilterState)
  const recoilStateReset = useResetRecoilState(marketFilterState)

  const collectionAddress = useCollectionAddress()
  const { data: traits } = useAPI<Record<string, { value: string; amount: number }[]>>(
    `/tokens/traits/${collectionAddress}`,
  )

  const { register, setValue, handleSubmit, watch, reset } = useForm({
    defaultValues: toFieldValues(filter),
  })

  const inputValues = watch()
  const { status, price, traits: inputTraits } = inputValues

  const toText = ({ min, max }: { min?: number; max?: number }, unit?: string) => {
    if (min && max) return `${min} - ${max}${unit}`
    if (min) return `> ${min}${unit}`
    if (max) return `< ${max}${unit}`
    return ""
  }

  const submit = handleSubmit((data) => {
    setFilter(fromFieldValues(data))
    onClose()
  })

  const { fn } = useMantineTheme()

  const inputStyle = {
    root: { flex: 1 },
    input: {
      background: "transparent",
      border: 0,
      color: fn.themeColor("mono.9"),
      fontSize: 16,
      fontWeight: 800,
      height: 60,
      textAlign: "right" as const,
    },
  }

  const [searchTraits, setSearchTraits] = useState<string>()

  return (
    <Box component="form" onSubmit={submit}>
      <Box h={`calc(100vh - 150px)`} sx={{ overflowY: "auto" }}>
        <Accordion
          h="100%"
          variant="separated"
          radius={12}
          styles={{
            control: {
              height: 72,

              "&[data-active]": {
                height: 60,
              },
            },
            item: {
              background: fn.themeColor("white"),

              "&[data-active]": {
                border: `2px solid ${fn.themeColor("black")}`,
              },
            },
            panel: {
              color: fn.themeColor("mono.2"),
            },
            content: {
              // content padding is declared directly in the content element
              padding: 0,
            },
          }}
        >
          <Accordion.Item value="sort">
            <Accordion.Control>
              <Group position="apart" fz={14}>
                <Text fw={800}>Status</Text>
                <Text fw={600}>{getTokenStatusLabel(status as TokenStatus)}</Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Radio.Group value={status} onChange={(value) => setValue("status", value)} pb={28} px={16}>
                <Stack spacing={12}>
                  {[TokenStatus.Open, TokenStatus.OnAuction, TokenStatus.All].map((value) => (
                    <RadioButton value={value} label={getTokenStatusLabel(value)} radioSize={18} key={value} />
                  ))}
                </Stack>
              </Radio.Group>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="price">
            <Accordion.Control>
              <Group position="apart" fz={14}>
                <Text fw={800}>Price</Text>
                {price && (
                  <Text c="mono.5" fw={600} fz={14}>
                    {toText(price, " INIT")}
                  </Text>
                )}
              </Group>
            </Accordion.Control>
            <Accordion.Panel sx={{ borderTop: `2px solid ${fn.themeColor("mono.3")}` }}>
              <Flex c="mono.5" fw={800} px={16} justify="space-around" sx={{ whiteSpace: "nowrap" }}>
                <Group noWrap sx={{ flex: 1 }}>
                  <Text tt="uppercase" fz={14}>
                    min
                  </Text>
                  <UnitInput {...register("price.min")} unit="INIT" styles={inputStyle} />
                </Group>
                <Divider orientation="vertical" mx={16} size={2} color="mono.3" />
                <Group noWrap sx={{ flex: 1 }}>
                  <Text tt="uppercase" fz={14}>
                    max
                  </Text>
                  <UnitInput {...register("price.max")} unit="INIT" styles={inputStyle} />
                </Group>
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>

          {traits && (
            <Accordion.Item value="traits">
              <Accordion.Control>
                <Group position="apart" fz={14} noWrap>
                  <Text fw={800}>Traits</Text>
                  {inputTraits?.stringTraits && (
                    <Text
                      c="mono.5"
                      fw={600}
                      display="block"
                      sx={{ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}
                    >
                      {inputTraits.stringTraits
                        .filter(({ value }) => !!value?.length) // unset traits are set to an empty array
                        .map(({ traitType, value }) => [traitType, value].join(": "))
                        .join(", ")}
                    </Text>
                  )}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Input
                  onChange={(value) => setSearchTraits(value.target.value)}
                  mx={16}
                  mb={4}
                  placeholder="Search traits"
                  radius={0}
                  icon={
                    <Text display="flex" c="black">
                      <Icon.Search />
                    </Text>
                  }
                  iconWidth={48}
                  styles={({ fn }) => ({
                    input: {
                      background: fn.themeColor("mono.1"),
                      color: "black",
                      height: 46,
                      border: 0,
                      borderRadius: 12,
                      fontSize: 14,
                      fontWeight: 700,

                      "&::placeholder": { color: fn.themeColor("mono.3") },
                    },
                  })}
                />

                <Accordion styles={{ control: { padding: 0 }, content: { padding: "10px 0" }, chevron: { margin: 0 } }}>
                  {Object.keys(traits).map((traitType, traitTypeIndex) => {
                    const traitList = traits[traitType as keyof typeof traits]

                    return (
                      <Accordion.Item
                        ml={20}
                        mr={16}
                        value={traitType}
                        key={traitType}
                        sx={{ "&:last-of-type": { border: 0 } }}
                      >
                        <Accordion.Control sx={{ "&:hover": { background: "transparent" } }}>
                          <Group fz={14} fw={800} position="apart">
                            <Input
                              {...register(`traits.stringTraits.${traitTypeIndex}.traitType`, { value: traitType })}
                              readOnly
                              sx={{ display: "none" }}
                            />
                            <Text>{toSentenceCase(traitType)}</Text>
                            <Text>{traitList.length}</Text>
                          </Group>
                        </Accordion.Control>
                        <Accordion.Panel>
                          <Stack spacing={16}>
                            {traitList
                              .filter(({ value }) => {
                                if (!value) return false
                                if (!searchTraits) return true
                                return value.includes(searchTraits)
                              })
                              .map(({ value, amount }) => (
                                <Group position="apart" key={value} sx={{ "&:last-of-type": { paddingBottom: 20 } }}>
                                  <Checkbox
                                    {...register(`traits.stringTraits.${traitTypeIndex}.value`)}
                                    indeterminate
                                    icon={CheckboxIcon}
                                    value={value}
                                    label={toSentenceCase(value)}
                                  />
                                  <Text c="mono.5" fz={12} fw={600}>
                                    {amount}
                                  </Text>
                                </Group>
                              ))}
                          </Stack>
                        </Accordion.Panel>
                      </Accordion.Item>
                    )
                  })}
                </Accordion>
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      </Box>

      <FixedBottom bottom={0}>
        <Group noWrap>
          <UnstyledButton
            px={30}
            onClick={() => {
              recoilStateReset()
              reset({
                ...defaultValue,
                traits: {
                  stringTraits: inputTraits?.stringTraits?.map((item) => ({ ...item, value: [] })) || [],
                },
              })
            }}
          >
            <Text fz={16} fw={800} c="mono.5" sx={{ whiteSpace: "nowrap" }}>
              Clear all
            </Text>
            <Divider size={3} color="mono.5" />
          </UnstyledButton>
          <SubmitButton>Apply</SubmitButton>
        </Group>
      </FixedBottom>
    </Box>
  )
}

export default MarketGameDetailsFilter
