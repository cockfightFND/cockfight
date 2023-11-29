import { useRecoilState } from "recoil"
import { useForm } from "react-hook-form"
import { evolve } from "ramda"
import BigNumber from "bignumber.js"
import {
  Box,
  Accordion,
  Divider,
  Flex,
  Group,
  Radio,
  Stack,
  Text,
  UnstyledButton,
  useMantineTheme,
} from "@mantine/core"
import { formatAmount, toAmount } from "@initia/utils"
import { DrawSort } from "@initia/marketplace-api-types"
import SubmitButton from "../../../components/SubmitButton"
import FixedBottom from "../../../components/FixedBottom"
import UnitInput from "../../../components/UnitInput"
import RadioButton from "../../../components/RadioButton"
import { drawFilterState } from "./draw-filter"

const toFieldValues = evolve({
  probability: {
    min: (value: number) => (value ? BigNumber(value).times(100).toString() : ""),
    max: (value: number) => (value ? BigNumber(value).times(100).toString() : ""),
  },
  price: {
    min: (value: string) => (value ? formatAmount(value, { comma: false }) : ""),
    max: (value: string) => (value ? formatAmount(value, { comma: false }) : ""),
  },
})

const fromFieldValues = evolve({
  probability: {
    min: (value: string) => (value ? BigNumber(value).div(100).toNumber() : undefined),
    max: (value: string) => (value ? BigNumber(value).div(100).toNumber() : undefined),
  },
  price: {
    min: (value: string) => (value ? toAmount(value) : undefined),
    max: (value: string) => (value ? toAmount(value) : undefined),
  },
})

const DrawGameDetailsFilter = ({ onClose }: { onClose: () => void }) => {
  const [filter, setFilter] = useRecoilState(drawFilterState)

  const { register, setValue, handleSubmit, watch, reset } = useForm({ defaultValues: toFieldValues(filter) })
  const { sort, probability, price } = watch()

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
      color: fn.themeColor("mono.0"),
      fontSize: 16,
      fontWeight: 800,
      height: 60,
      textAlign: "right" as const,
    },
  }

  return (
    <Box component="form" onSubmit={submit}>
      <Box h={`calc(100vh - 150px)`} sx={{ overflowY: "auto" }}>
        <Accordion
          variant="separated"
          radius={12}
          styles={{
            control: {
              color: fn.themeColor("mono.2"),
              height: 72,

              "&[data-active]": {
                height: 60,
              },
            },
            item: {
              background: fn.themeColor("mono.8"),

              "&[data-active]": {
                background: fn.themeColor("mono.8"),
                border: `2px solid ${fn.themeColor("mono.2")}`,
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
                <Text fw={800}>Sort</Text>
                <Text fw={600}>{toSentenceCase(sort)}</Text>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>
              <Radio.Group value={sort} onChange={(value) => setValue("sort", value)} pb={28} px={16}>
                <Stack spacing={12}>
                  {[
                    DrawSort.MostPopular,
                    DrawSort.MostRecent,
                    DrawSort.DrawPriceLowToHigh,
                    DrawSort.DrawPriceHighToLow,
                    DrawSort.WinProbabilityLowToHigh,
                    DrawSort.WinProbabilityHighToLow,
                  ].map((value) => (
                    <RadioButton value={value} label={toSentenceCase(value)} radioSize={18} key={value} />
                  ))}
                </Stack>
              </Radio.Group>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="probability">
            <Accordion.Control>
              <Group position="apart" fz={14}>
                <Text fw={800}>Probability</Text>
                {probability && <Text fw={600}>{toText(probability, "%")}</Text>}
              </Group>
            </Accordion.Control>
            <Accordion.Panel sx={{ borderTop: `2px solid ${fn.themeColor("mono.7")}` }}>
              <Flex px={16} justify="space-around" sx={{ whiteSpace: "nowrap" }}>
                <Group noWrap sx={{ flex: 1 }}>
                  <Text tt="uppercase" fz={14}>
                    min
                  </Text>
                  <UnitInput {...register("probability.min")} unit="%" styles={inputStyle} />
                </Group>
                <Divider orientation="vertical" mx={16} size={2} color="mono.7" />
                <Group noWrap sx={{ flex: 1 }}>
                  <Text tt="uppercase" fz={14}>
                    max
                  </Text>
                  <UnitInput {...register("probability.max")} unit="%" styles={inputStyle} />
                </Group>
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="price">
            <Accordion.Control>
              <Group position="apart" fz={14}>
                <Text fw={800}>Draw Price</Text>
                {price && <Text fw={600}>{toText(price, " INIT")}</Text>}
              </Group>
            </Accordion.Control>
            <Accordion.Panel sx={{ borderTop: `2px solid ${fn.themeColor("mono.7")}` }}>
              <Flex px={16} justify="space-around" sx={{ whiteSpace: "nowrap" }}>
                <Group noWrap sx={{ flex: 1 }}>
                  <Text tt="uppercase" fz={14}>
                    min
                  </Text>
                  <UnitInput {...register("price.min")} unit="INIT" styles={inputStyle} />
                </Group>
                <Divider orientation="vertical" mx={16} size={2} color="mono.7" />
                <Group noWrap sx={{ flex: 1 }}>
                  <Text tt="uppercase" fz={14}>
                    max
                  </Text>
                  <UnitInput {...register("price.max")} unit="INIT" styles={inputStyle} />
                </Group>
              </Flex>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Box>

      <FixedBottom bottom={0}>
        <Group noWrap>
          <UnstyledButton px={30} onClick={() => reset()}>
            <Text fz={16} fw={800} c="mono.6" sx={{ whiteSpace: "nowrap" }}>
              Clear all
            </Text>
            <Divider size={3} color="mono.6" />
          </UnstyledButton>
          <SubmitButton invert>Apply</SubmitButton>
        </Group>
      </FixedBottom>
    </Box>
  )
}

export default DrawGameDetailsFilter

/* utils */
function toSentenceCase(str: string) {
  return str
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
}
