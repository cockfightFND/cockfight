import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import type { BoxProps } from "@mantine/core"
import { Box, Button, Group, Stack, Text, UnstyledButton, keyframes } from "@mantine/core"
import BigNumber from "bignumber.js"
import Icon from "../../../styles/icons/Icon"
import { useBalance } from "../../../data/account"
import NumberButton from "./NumberButton"
import { useDrawPoolEntry } from "./DrawPoolEntryContext"
import { formatAmount } from "@initia/utils"
import { Num } from "@initia/react-components"
import FixedBottom from "../../../components/FixedBottom"

interface Props extends BoxProps {
  childprops?: BoxProps
}

const DrawButtons = (props: Props) => {
  const navigate = useNavigate()
  const balance = useBalance()
  const { pool, ticketAmount, setTicketAmount, submit } = useDrawPoolEntry()
  const { ticketPrice } = pool

  const isInsufficient = BigNumber(ticketPrice.amount).times(ticketAmount).gt(balance)
  const isMobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)

  const [currButton, setCurrButton] = useState(0)

  useEffect(() => {
    setTimeout(() => setCurrButton(ticketAmount), 500)
  }, [ticketAmount, ticketPrice])

  const rotate = keyframes({
    "0%": { transform: currButton === 1 ? "rotate(-37deg)" : currButton === 10 ? "rotate(1deg)" : "rotate(38deg)" },
    "100%": {
      transform: ticketAmount === 1 ? "rotate(-37deg)" : ticketAmount === 10 ? "rotate(1deg)" : "rotate(38deg)",
    },
  })

  const active = keyframes({
    "0%": { opacity: 0 },
    "50%": { opacity: 0 },
    "100%": { opacity: 1 },
  })

  const renderBottom = () => {
    return (
      <Button
        onClick={submit}
        disabled={!ticketAmount || isInsufficient}
        w={256}
        h={256}
        mt={20}
        p={0}
        sx={({ fn }) => ({
          position: "sticky",
          bottom: 0,
          transform: "translateY(50%)",
          borderRadius: "50%",
          background: "linear-gradient(90deg, #543ABE 2.56%, #5830BF 100%)",
          boxShadow: "0px 8px 8px 0px hsla(256, 68%, 25%, 0.35)",
          ":disabled": {
            background: "linear-gradient(90deg, #543ABE 2.56%, #5830BF 100%)",
            ".mantine-Text-root": {
              color: fn.themeColor("purple.2"),
            },
          },
          ":active": {
            transform: "translateY(50%)",
          },
          ".mantine-Button-inner": {
            borderRadius: "50%",
            boxShadow: `0px 2px 5px 0px hsla(0, 0%, 100%, 0.15) inset,
            0px -3px 7px 0px hsla(0, 0%, 0%, 0.16) inset`,
          },
        })}
      >
        <Stack pt={50} spacing={6} h="100%" align="center">
          <Group spacing={2} fw={400} ff="Fugaz One" align="baseline">
            <Num
              amount={formatAmount(BigNumber(ticketPrice.amount).times(ticketAmount).toString())}
              decimals={0}
              fixedByAmount
              size={16}
              decimalSize={12}
            />
            <Text fz={12} ff="Fugaz One">
              INIT
            </Text>
          </Group>
          <Text ff="Fugaz One" fw={400} fz={32} tt="uppercase">
            Shuffle
          </Text>
        </Stack>
      </Button>
    )
  }

  return (
    <FixedBottom
      bottom={isMobile ? 0 : 308}
      left={isMobile ? 0 : -16}
      right={isMobile ? 0 : 0}
      sx={
        isMobile
          ? {
              zIndex: 1,
            }
          : {
              zIndex: 1,
              "& > div": {
                paddingTop: 48,
                overflow: "hidden",
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              },
            }
      }
      childprops={
        isMobile
          ? undefined
          : {
              w: 375,
              ...props.childprops,
            }
      }
      {...props}
    >
      <Stack spacing={28} align="center" pos="relative">
        <Box
          w={538}
          h={538}
          sx={({ fn }) => ({
            position: "absolute",
            bottom: 0,
            transform: "translateY(50%)",
            borderRadius: "50%",
            background: fn.themeColor("purple.0"),
            boxShadow: "0px -8px 20px 0px #5028AA80",
          })}
        />
        <Box
          w={406}
          h={406}
          sx={({ fn }) => ({
            position: "absolute",
            bottom: 0,
            transform: "translateY(50%)",
            border: `2px solid ${fn.themeColor("purple.1")}`,
            borderRadius: "50%",
            background: fn.themeColor("purple.0"),
          })}
        >
          {[1, 10, 100].map((n) => (
            <NumberButton n={n} isActive={n === ticketAmount} onClick={() => setTicketAmount(n)} key={n} />
          ))}
          <Box
            w={406}
            h={406}
            sx={{
              position: "absolute",
              top: -1,
              left: -2,
              borderRadius: "50%",
              background: "transparent",
              transform: ticketAmount === 1 ? "rotate(-37deg)" : ticketAmount === 10 ? "rotate(1deg)" : "rotate(38deg)",
              animation: !!currButton ? `${rotate} 500ms` : ticketAmount ? `${active} 500ms` : undefined,
              transition: `${!!currButton ? "all" : "opacity"} 500ms ease-out`,
            }}
          >
            {!!ticketAmount && (
              <Box
                w={ticketAmount === 1 ? 48 : ticketAmount === 10 ? 62 : 92}
                h={ticketAmount === 1 ? 48 : ticketAmount === 10 ? 62 : 92}
                sx={({ fn }) => ({
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  borderRadius: "50%",
                  background: "white",
                  boxShadow: `0px 6px 16px 0px #2B146959, 0px 3px 5px 0px #FFFFFF33 inset, 0px -5px 5px 0px #00000029 inset`,
                  zIndex: 2,
                })}
              ></Box>
            )}
          </Box>
        </Box>
        {renderBottom()}
        {isInsufficient && (
          <Stack align="center" spacing={6} pos="absolute" bottom={16}>
            <UnstyledButton
              c="danger"
              fz={12}
              fw={600}
              onClick={() => navigate("/my")}
              bg="#351E73"
              px={13}
              py={5}
              sx={{ borderRadius: 20 }}
            >
              <Group spacing={0}>
                <Text>Deposit INIT to NFT Market</Text>
                <Icon.ChevronRight width={10} height={10} />
              </Group>
            </UnstyledButton>
          </Stack>
        )}
      </Stack>
    </FixedBottom>
  )
}

export default DrawButtons
